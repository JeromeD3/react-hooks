import debounce from 'lodash/debounce'
import { useMemo } from 'react'
import useUnmount from '../LifeCycle/useUnmount'
import { useLatest } from '../Advanced/useLatest'

const useDebounceFn = (fn: any, options: any) => {
  const fnRef = useLatest(fn)
  const wait = options?.wait ?? 1000
  const debounced = useMemo(() => {
    return debounce(
      (...args) => {
        return fnRef.current(...args)
      },
      wait,
      options
    )
  }, [])
  useUnmount(() => {
    debounced.cancel() // 销毁，及时释放空间
  })
  return {
    run: debounced, // 执行函数
    cancel: debounced.cancel, // 手动销毁防抖
    flush: debounced.flush, // 手动触发防抖
  }
}

export default useDebounceFn
