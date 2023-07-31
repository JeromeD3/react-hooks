// import useLoadingDelayPlugin from "./plugins/useLoadingDelayPlugin"
// import usePollingPlugin from "./plugins/usePollingPlugin"
// import useLoggerPlugin from "./plugins/useLoggerplugin"
// import useAutoRunPlugin from "./plugins/useAutoRunPlugin"
// import useRetryPlugin from "./plugins/useRetryPlugin"
import useCachePlugin from './plugins/useCachePlugin'
import { Options, Service, Plugin } from './types'
import useRequestImplement from './useRequestImplement'
// import useRefreshOnWindowFocusPlugin from "./plugins/useRefreshOnWindowFocusPlugin"
// import useRetryPlugin from "./plugins/useCachePlugin"

function useRequest<TData, TParams extends any[]>(service: Service<TData, TParams>, options?: Options<TData, TParams>, plugins?: Plugin<TData, TParams>[]) {
  return useRequestImplement<TData, TParams>(service, options, [
    // 插件列表，用来拓展功能，一般用户不使用。文档中没有看到暴露 API
    ...(plugins || []),

    // useLoggerPlugin
    // useDebouncePlugin,
    // useLoadingDelayPlugin,
    // usePollingPlugin,
    // useRefreshOnWindowFocusPlugin,
    // useThrottlePlugin,
    // useAutoRunPlugin,
    useCachePlugin,
    // useRetryPlugin,
  ] as Plugin<TData, TParams>[])
}

export default useRequest
import { clearCache } from './utils/cache'
export { clearCache }
