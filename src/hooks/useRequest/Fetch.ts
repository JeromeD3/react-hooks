import { MutableRefObject } from 'react'
import { FetchState, Options, PluginReturn, Service, Subscribe } from './types'

const isFunction = (value: unknown): value is (...args: any) => any => typeof value === 'function'

export default class Fetch<TData, TParams extends any[]> {
  pluginImpls: PluginReturn<TData, TParams>[];

  count: number = 0

  state: FetchState<TData, TParams> = {
    loading: false,
    params: undefined,
    data: undefined,
    error: undefined,
  }

  constructor(
    public serviceRef: MutableRefObject<Service<TData, TParams>>,
    public options: Options<TData, TParams>,
    public subscribe: Subscribe,
    public initState: Partial<FetchState<TData, TParams>> = {}
  ) {
    this.state = {
      ...this.state,
      loading: !options.manual,
      ...initState,
    }
  }

  setState(s: Partial<FetchState<TData, TParams>> = {}) {
    // 新的数据和旧的数据合并
    this.state = {
      ...this.state,
      ...s,
    }
    // 强制刷新组件
    this.subscribe()
  }

  // 执行插件，返回真值给到一个对象中
  runPluginHandler(event: keyof PluginReturn<TData, TParams>, ...rest: any[]) {
    // @ts-ignore
    const r = this.pluginImpls.map((i) => i[event]?.(...rest)).filter(Boolean)
    return Object.assign({}, ...r)
  }

  async runAsync(...params: TParams): Promise<TData> {
    console.log('发起了请求')
    this.count += 1
    const currentCount = this.count

    const { stopNow = false, returnNow = false, ...state } = this.runPluginHandler('onBefore', params)
    // stop request
    if (stopNow) {
      return new Promise(() => {})
    }

    // 在before前操作缓存可以控制loading的显示
    this.setState({
      loading: true,
      params,
      ...state,
    })

    // 返回缓存的数据，就不用请求了
    if (returnNow) {
      console.log('还在缓存期间，返回缓存的数据')
      return Promise.resolve(state.data)
    }

    this.options.onBefore?.(params)

    try {
      //  可以根据插件请求自定义返回值 --> 狸猫换太子
      let { servicePromise } = this.runPluginHandler('onRequest', this.serviceRef.current, params)
      if (!servicePromise) {
        // 如果没有的话就直接执行请求
        servicePromise = this.serviceRef.current(...params)
      }
      console.log('开始请求')
      // 因为这里是异步操作 ，插件如果用到了定时器，会先执行插件的代码
      const res = await servicePromise
      console.log("请求结果：",res)

      // 执行请求
      if (currentCount !== this.count) {
        // prevent run.then when request is canceled
        return new Promise(() => {})
      }

      this.setState({
        data: res,
        error: undefined,
        loading: false,
      })
      this.options.onSuccess?.(res, params)
      this.runPluginHandler('onSuccess', res, params)
      console.log("执行成功")
      
      this.options.onFinally?.(params, res, undefined)

      if (currentCount === this.count) {
        // 做if判断是为了执行插件的时候可以取消
        this.runPluginHandler('onFinally', params, res, undefined)
      }

      return res
    } catch (error) {
      if (currentCount !== this.count) {
        // prevent run.then when request is canceled
        return new Promise(() => {})
      }

      this.setState({
        error,
        loading: false,
      })

      this.options.onError?.(error, params)
      this.runPluginHandler('onError', error, params)

      this.options.onFinally?.(params, undefined, error)

      if (currentCount === this.count) {
        this.runPluginHandler('onFinally', params, undefined, error)
      }

      throw error
    }
  }

  // 与runAsync的区别就是一个需要自己处理错误，一个不需要
  run(...params: TParams) {
    console.log("执行run")
    this.runAsync(...params).catch((error) => {
      if (!this.options.onError) {
        console.error(error)
      }
    })
  }

  cancel() {
    console.log('取消了请求')

    // 通过设置count值来取消请求
    this.count += 1
    this.setState({
      loading: false,
    })

    // console.error('     ??  why not add Custom cancellation method')
    // 因为取消只能从请求库里面做，所以这里只能通过手动处理
    // this.options.onCancel?.()
    this.runPluginHandler('onCancel')
  }

  // 再次执行run重复上一次请求
  refresh() {
    // @ts-ignore
    this.run(...(this.state.params || []))
  }
  // 区别和run一样，一个需要手动处理错误
  refreshAsync() {
    // @ts-ignore
    return this.runAsync(...(this.state.params || []))
  }

  //  主要用于乐观更新，先更新数据，然后再请求
  mutate(data?: TData | ((oldData?: TData) => TData | undefined)) {
    const targetData = isFunction(data) ? data(this.state.data) : data
    this.runPluginHandler('onMutate', targetData)
    this.setState({
      data: targetData,
    })
  }
}
