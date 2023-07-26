import useRequestImplement from "./useRequestImplement"

function useRequest(service: any, options?: any, plugins?: any) {
  return useRequestImplement(service, options, [
    // 插件列表，用来拓展功能，一般用户不使用。文档中没有看到暴露 API
    ...(plugins || []),
    // useDebouncePlugin,
    // useLoadingDelayPlugin,
    // usePollingPlugin,
    // useRefreshOnWindowFocusPlugin,
    // useThrottlePlugin,
    // useAutoRunPlugin,
    // useCachePlugin,
    // useRetryPlugin,
  ])
}

export default useRequest
