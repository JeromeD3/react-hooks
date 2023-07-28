import { useRef } from 'react'
const useRetryPlugin = (fetchInstance: any, { retryInterval, retryCount }: any) => {
  const timerRef = useRef<any>() //定时器
  const countRef = useRef(0) //重试的次数
  const triggerByRetry = useRef(false) //是否由重试触发

  if (!retryCount) {
    return {}
  }

  return {
    onBefore: () => {
      if (!triggerByRetry.current) {
        countRef.current = 0
      }

      triggerByRetry.current = false

      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    },
    onSuccess: () => {
      countRef.current = 0
    },
    onError: () => {
      countRef.current += 1
      // -1 为无限次重试
      if (retryCount === -1 || countRef.current <= retryCount) {
        // 重试时间
        const timeout = retryInterval ?? Math.min(1000 * 2 ** countRef.current, 30000)
        timerRef.current = setTimeout(() => {
          triggerByRetry.current = true
          fetchInstance.refresh()
        }, timeout)
      } else {
        countRef.current = 0
      }
    },
    onCancel: () => {
      countRef.current = 0

      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    },
  }
}

export default useRetryPlugin
