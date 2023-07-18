import { useRef } from 'react'

/**
 * 
 *  总是能够获取一个状态的最新值的 hook！
 * 可以避免闭包问题！
 * 实质上就是解决引用问题
 */
export const useLatest = (v: any) => {
  const ref = useRef(v)
  ref.current = v
  return ref
}
