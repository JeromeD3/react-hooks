import { useEffect } from 'react'
import { useLatest } from '../Advanced/useLatest'

/**
 *
 * 在组件卸载时，执行函数的hook。
 */
// 复用我们之前写的hook：

const useUnmount = (callback: any) => {
  const cbRef = useLatest(callback)
  useEffect(
    () => () => {
      cbRef.current()
    },
    []
  )
}

export default useUnmount
