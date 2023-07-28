// import useLoadingDelayPlugin from "./plugins/useLoadingDelayPlugin"
// import usePollingPlugin from "./plugins/usePollingPlugin"
// import useLoggerPlugin from "./plugins/useLoggerplugin"
// import useAutoRunPlugin from "./plugins/useAutoRunPlugin"
import useRequestImplement from "./useRequestImplement"
import useRefreshOnWindowFocusPlugin from "./plugins/useRefreshOnWindowFocusPlugin"


function useRequest(service: any, options?: any, plugins?: any) {
  return useRequestImplement(service, options, [
    // 插件列表，用来拓展功能，一般用户不使用。文档中没有看到暴露 API
    ...(plugins || []),
    // useLoadingDelayPlugin
    // usePollingPlugin
    // useLoggerPlugin
    // useDebouncePlugin,
    // useLoadingDelayPlugin,
    // usePollingPlugin,
    useRefreshOnWindowFocusPlugin,
    // useThrottlePlugin,
    // useAutoRunPlugin,
    // useCachePlugin,
    // useRetryPlugin,
  ])
}

export default useRequest
