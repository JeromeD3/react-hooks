// 网站主题、语言等偏好设置的存储
// 在用户退出登录之后，可以存储用户之前的状态并在下次登录时还原状态
// 在跨页面之间共享数据的时候
import Cookies from 'js-cookie'
import { useState } from 'react'
import { useUpdateEffect } from '../Effect/useUpdateEffect'
import useMemoizedFn from '../Advanced/useMemoizedFn'

const isFunction = (val: any): val is Function => typeof val === 'function'
const isUndef = (val: any): val is undefined => typeof val === 'undefined'
const isString = (val: any): val is string => typeof val === 'string'

function useCookieState(cookieKey: string, options: any = {}) {
  // 返回默认值
  function getDefaultValue() {
    return isFunction(options?.defaultValue) ? options?.defaultValue() : options?.defaultValue
  }

  function setStoredValue(newValue: any, newOptions: Cookies.CookieAttributes = {}) {
    const { defaultValue, ...restOptions } = newOptions

    if (isUndef(newValue)) {
      Cookies.remove(cookieKey)
    } else {
      Cookies.set(cookieKey, newValue, restOptions)
    }
  }

  function getStoredValue() {
    const cookieValue = Cookies.get(cookieKey)

    if (isString(cookieValue)) return cookieValue

    // 没有的话直接返回默认值
    const defaultValue = getDefaultValue()
    setStoredValue(defaultValue)
    return defaultValue
  }

  const [state, setState] = useState(() => getStoredValue())

  useUpdateEffect(() => {
    setState(getStoredValue())
  }, [cookieKey])

  const updateState = useMemoizedFn(
    (newValue: any | ((prevState: any) => any), newOptions: any = {}) => {
      const currentValue = isFunction(newValue) ? newValue(state) : newValue

      setState(currentValue)
      setStoredValue(currentValue, newOptions)
    }
  )

  return [state, updateState] as const
}

export default useCookieState
