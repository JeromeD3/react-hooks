/**
 * 只在初始化时执行，和useUpdateEffect刚好相反
 */
import { useEffect } from 'react'

const isFunction = (fn: any): fn is Function => typeof fn === 'function'

const useMount = (fn: () => void) => {
  // if (isDev) {
  if (!isFunction(fn)) {
    console.error(`useMount: parameter \`fn\` expected to be a function, but got "${typeof fn}".`)
  }
  // }

  useEffect(() => {
    fn?.()
  }, [])
}

export default useMount
