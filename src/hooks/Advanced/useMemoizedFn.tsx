import { useMemo, useRef } from 'react'

/**
 *  被包住的函数保持引用
 */
const useMemoizedFn = (fn: any) => {
  // 通过 useRef 保持其引用地址不变，并且值能够保持值最新
  const fnRef = useRef(fn)
  
  // 无意义的，但是能保证devtool 模式下的异常行为。
  fnRef.current = useMemo(() => fn, [fn])

  // 为什么又加了一个 useRef ？
  const memoizedFn: any = useRef()
  if (!memoizedFn.current) {
    // 返回的持久化函数，调用该函数的时候，调用原始的函数
    memoizedFn.current = function (this, ...args: any) {
      return fnRef.current.apply(this, args)
    }
  }

  return memoizedFn.current
}

export default useMemoizedFn
