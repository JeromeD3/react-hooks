/* eslint-disable no-empty */
import { useState } from 'react'
import { useUpdateEffect } from '../Effect/useUpdateEffect'
import useMemoizedFn from '../Advanced/useMemoizedFn'

function isFunction(obj: any) {
  return typeof obj === 'function'
}

function isUndef(obj: any) {
  return typeof obj === 'undefined'
}

export function createUseStorageState(getStorage: () => Storage | undefined) {
  function useStorageState<T>(key: string, options?: any) {
    let storage: Storage | undefined

    // https://github.com/alibaba/hooks/issues/800
    try {
      // getStorage === localStorage
      storage = getStorage()
    } catch (err) {
      console.error(err)
    }

    // 自定义序列化
    const serializer = (value: T) => {
      if (options?.serializer) {
        return options?.serializer(value)
      }
      return JSON.stringify(value)
    }

    // 自定义反序列化
    const deserializer = (value: string) => {
      if (options?.deserializer) {
        return options?.deserializer(value)
      }
      return JSON.parse(value)
    }

    // 获取默认值
    function getDefaultValue() {
      return isFunction(options?.defaultValue) ? options?.defaultValue() : options?.defaultValue
    }

    function setStoredValue(value?: any) {
      if (isUndef(value)) {
        storage?.removeItem(key)
      } else {
        try {
          storage?.setItem(key, serializer(value))
        } catch (e) {
          console.error(e)
        }
      }
    }

    function getStoredValue() {
      try {
        const raw = storage?.getItem(key)
        if (raw) {
          return deserializer(raw)
        }
      } catch (e) {
        console.error(e)
      }

      // 如果没有就返回一个默认值
      const defaultValue = getDefaultValue()

      setStoredValue(defaultValue)

      return defaultValue
    }

    const [state, setState] = useState(() => getStoredValue())

    useUpdateEffect(() => {
      setState(getStoredValue())
    }, [key])

    const updateState = (value: any) => {
      const currentState = isFunction(value) ? value(state) : value

      setState(currentState)
      setStoredValue(currentState)
    }

    return [state, useMemoizedFn(updateState)] as const
  }
  return useStorageState
}
