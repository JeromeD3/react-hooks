import { useEffect } from 'react'

const isFunction = (value: any) => typeof value === 'function'

const isAsyncGenerator = (val: any) => isFunction(val[Symbol.asyncIterator]) // 判断是否为Generator函数

type Effect = (isCanceled: () => boolean) => Promise<void> | AsyncGenerator<void, void, void>

const useAsyncEffect = (effect: Effect, deps: any) => {
  return useEffect(() => {
    let cancelled = false
    // 主要的改动就是下面这里，传入这个回调即可
    const e: any = effect(() => cancelled) // 这里是个异步任务
    console.log('2. 执行依赖函数后:', cancelled)

    const execute = async () => {
      console.log('execute', e)

      if (isAsyncGenerator(e)) {
        // 判断是否为Generator函数,是的话就一直执行，等到done为true或者cancelled为true时跳出循环
        console.log(e)
        while (true) {
          const result = await e.next()
          if (result.done || cancelled) break
        }
      } else {
        await e
      }
    }

    execute()

    console.log("3. 执行依赖函数后:", cancelled);
    
    return () => {
      console.log("4. 返回effect:", cancelled);
      
      cancelled = true
    }
  }, deps)
}
export default useAsyncEffect
