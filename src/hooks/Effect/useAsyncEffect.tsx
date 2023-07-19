import { useEffect } from 'react'
const isFunction = (value: any) => {
  return typeof value === 'function'
}
const isAsyncGenerator = (val: any) => {
  return isFunction(val[Symbol.asyncIterator])
}
type Effect = (isCanceled: () => boolean) => Promise<void> | AsyncGenerator<void, void, void>

const useAsyncEffect = (effect: Effect, deps: any) => {
  return useEffect(() => {
    let cancelled = false
    // 主要的改动就是下面这里，传入这个回调即可
    const e: any = effect(() => cancelled)
    const execute = async () => {
      if (isAsyncGenerator(e)) {
        while (true) {
          const result = await e.next()
          if (result.done || cancelled) break
        }
      } else {
        await e
      }
    }
    execute()
    return () => {
      cancelled = true
    }
  }, deps)
}
export default useAsyncEffect
