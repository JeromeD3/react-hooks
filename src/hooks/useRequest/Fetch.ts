/* eslint-disable @typescript-eslint/no-parameter-properties */

const isFunction = (fn: any) => typeof fn === 'function'

export default class Fetch {
  pluginImpls: any[] = []

  count: number = 0

  state = {
    loading: false,
    params: undefined,
    data: undefined,
    error: undefined,
  }

  constructor(
    public serviceRef: any,
    public options: any,
    public subscribe: any,
    public initState: any = {}
  ) {
    this.state = {
      ...this.state,
      loading: !options.manual,
      ...initState,
    }
  }

  setState(s: any = {}) {
    // 新的数据和旧的数据合并
    this.state = {
      ...this.state,
      ...s,
    }
    // 强制刷新组件
    this.subscribe()
  }

  // 执行插件，返回真值给到一个对象中
  runPluginHandler(event: any, ...rest: any[]) {
    // @ts-ignore
    const r = this.pluginImpls.map((i) => i[event]?.(...rest)).filter(Boolean)
    return Object.assign({}, ...r)
  }

  async runAsync(...params: any): Promise<any> {
    console.log('发起了请求')

    this.count += 1
    const currentCount = this.count

    const {
      stopNow = false,
      returnNow = false,
      ...state
    } = this.runPluginHandler('onBefore', params)
    // stop request
    if (stopNow) {
      return new Promise(() => {})
    }

    this.setState({
      loading: true,
      params,
      ...state,
    })

    // 返回缓存的数据
    if (returnNow) {
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

      const res = await servicePromise

      // 执行请求
      if (currentCount !== this.count) {
        // prevent run.then when request is canceled
        return new Promise(() => {})
      }

      // const formattedResult = this.options.formatResultRef.current ? this.options.formatResultRef.current(res) : res;

      this.setState({
        data: res,
        error: undefined,
        loading: false,
      })

      this.options.onSuccess?.(res, params)
      this.runPluginHandler('onSuccess', res, params)

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
  run(...params: any) {
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
  mutate(data?: any | ((oldData?: any) => any | undefined)) {
    const targetData = isFunction(data) ? data(this.state.data) : data
    this.runPluginHandler('onMutate', targetData)
    this.setState({
      data: targetData,
    })
  }
}
