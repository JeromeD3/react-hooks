import { useRef } from 'react'
const useLoadingDelayPlugin = (fetchInstance: any, { loadingDelay }: any) => {
  const timerRef = useRef()
  if (!loadingDelay) {
    return {}
  }

  // 清除延迟加载的定时器
  const cancelTimeout = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
  }


  return {
    onBefore: () => {
      cancelTimeout()
      timerRef.current = setTimeout(() => {
        console.log("插件开始执行")
        // 如果超过了延迟时间，就显示loading
        fetchInstance.setState({
          loading: true,
        })
      }, loadingDelay)

      // 默认一开始是不显示loading的
      return {
        loading: false,
      }
    },
    onFinally: () => {
      cancelTimeout()
    },
    onCancel: () => {
      cancelTimeout()
    },
  }
}
export default useLoadingDelayPlugin
