import { useEffect, useState } from 'react'
import { isBrowser } from '../../useRequest/utils/isBrowser'

const getInitialState = (query: string, defaultState?: boolean) => {
  // ssr support
  if (defaultState !== undefined) {
    return defaultState
  }

  if (isBrowser) {
    return window.matchMedia(query).matches
  }

  // 在ssr场景下，没有默认值，且在服务端的情况下，会打印警告，防止水合不一致
  if (process.env.NODE_ENV !== 'production') {
    console.warn('`useMedia` When server side rendering, defaultState should be defined to prevent a hydration mismatches.')
  }

  return false
}

const useMedia = (query: string, defaultState?: boolean) => {
  const [state, setState] = useState<boolean>(getInitialState(query, defaultState))

  useEffect(() => {
    let mounted = true
    const mql = window.matchMedia(query) // 是否匹配媒体查询
    const onChange = () => {
      if (!mounted) {
        return
      }
      setState(!!mql.matches)
    }

    mql.addEventListener('change', onChange)
    setState(mql.matches)

    return () => {
      mounted = false // 组件销毁的时候，取消监听
      mql.removeEventListener('change', onChange)
    }
  }, [query])

  return state
}

export default useMedia
