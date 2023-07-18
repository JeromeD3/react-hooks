import { useCallback, useRef } from 'react'

const useLockFn = (fn: any) => {
  const lockRef = useRef(false)

  return useCallback(async (...args: any) => {
    if (lockRef.current) return // 锁定期间，不做处理
    lockRef.current = true // 上锁
    const res = await fn(...args)
    lockRef.current = false // 解锁
    return res
  },[])
}
export default useLockFn
