import { useRef } from 'react'
import { useUpdateEffect } from '../../Effect/useUpdateEffect'
const useAutoRunPlugin = (
  fetchInstance: any,
  { manual, ready = true, defaultParams = [] }: any
) => {
  const hasAutoRun = useRef(false)
  hasAutoRun.current = false
  console.log('插件执行')

  useUpdateEffect(() => {
    //  如果没有传ready的话，默认是发起请求的
    if (!manual && ready) {
      hasAutoRun.current = true
      fetchInstance.run(...defaultParams) // 这里调run是为了自动执行
    }
  }, [ready])

  return {
    onBefore: () => {
      if (!ready) {
        return {
          stopNow: true,
        }
      }
    },
  }
}

useAutoRunPlugin.onInit = ({ ready = true, manual }: any) => {
  return {
    loading: !manual && ready,
  }
}

export default useAutoRunPlugin
