import { useEffect, useRef } from 'react'
import useUnmount from '../../LifeCycle/useUnmount'
import subscribeFocus from '../utils/subscribeFocus'
import limit from '../utils/limit'

const useRefreshOnWindowFocusPlugin = (
  fetchInstance: any,
  { refreshOnWindowFocus, focusTimespan = 5000 }: any
) => {
  const unsubscribeRef = useRef<any>()

  const stopSubscribe = () => { // 其实这里就只有组件卸载掉时候用到 --> 事件执行后直接挂载到全局
    unsubscribeRef.current?.()
  }
  
  useEffect(() => {
    if (refreshOnWindowFocus) {
      // 实现一个限流函数，防止短时间内多次触发
      const limitRefresh = limit(fetchInstance.refresh.bind(fetchInstance), focusTimespan)
      unsubscribeRef.current = subscribeFocus(() => limitRefresh())
    }
    return () => {
      stopSubscribe()
    }
  }, [refreshOnWindowFocus, focusTimespan])

  useUnmount(() => {
    stopSubscribe()
  })
  return {}
}

export default useRefreshOnWindowFocusPlugin
