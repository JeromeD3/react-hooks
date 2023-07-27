// const isDev = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
import useCreation from '../Advanced/useCreation'
import { useLatest } from '../Advanced/useLatest'
import useMemoizedFn from '../Advanced/useMemoizedFn'
import useUpdate from '../Effect/useUpdate'
import useMount from '../LifeCycle/useMount'
import useUnmount from '../LifeCycle/useUnmount'
import Fetch from './Fetch'

function useRequestImplement(
  service: any, // 获取数据的函数，返回Promise
  options: any = {},
  plugins: any = []
) {
  const { manual = false, ...rest } = options
  
  // if (isDev) {
  if (options.defaultParams && !Array.isArray(options.defaultParams)) {
    console.warn(`expected defaultParams is array, got ${typeof options.defaultParams}`)
  }
  // }

  const fetchOptions = {
    manual,
    ...rest,
  }

  const serviceRef = useLatest(service) // 将service保存在ref中，避免service变化导致的重复请求

  const update = useUpdate() // 强制更新组件

  // 创建实例，只有初始化时才会创建
  const fetchInstance = useCreation(() => {
    // 初始值 ---> 经过插件处理的值
    const initState = plugins.map((p: any) => p?.onInit?.(fetchOptions)).filter(Boolean) // 过滤掉空的
    return new Fetch(serviceRef, fetchOptions, update, Object.assign({}, ...initState))
  }, [])

  fetchInstance.options = fetchOptions
  // run all plugins hooks
  fetchInstance.pluginImpls = plugins.map((p: any) => p(fetchInstance, fetchOptions))


  // 只有初始化时才会执行
  useMount(() => {
    // 判断是否手动触发
    if (!manual) {
      // 自动触发
      // useCachePlugin can set fetchInstance.state.params from cache when init
      const params = fetchInstance.state.params || options.defaultParams || []
      // @ts-ignore
      fetchInstance.run(...params)
    }
  })


  // 只有卸载时才会执行
  useUnmount(() => {
    fetchInstance.cancel()
  })

  return {
    loading: fetchInstance.state.loading,
    data: fetchInstance.state.data,
    error: fetchInstance.state.error,
    params: fetchInstance.state.params || [],
    cancel: useMemoizedFn(fetchInstance.cancel.bind(fetchInstance)),
    refresh: useMemoizedFn(fetchInstance.refresh.bind(fetchInstance)),
    refreshAsync: useMemoizedFn(fetchInstance.refreshAsync.bind(fetchInstance)),
    run: useMemoizedFn(fetchInstance.run.bind(fetchInstance)),
    runAsync: useMemoizedFn(fetchInstance.runAsync.bind(fetchInstance)),
    mutate: useMemoizedFn(fetchInstance.mutate.bind(fetchInstance)),
  }
}

export default useRequestImplement
