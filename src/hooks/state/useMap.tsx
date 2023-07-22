import { useState } from 'react'
import useMemoizedFn from '../Advanced/useMemoizedFn'

function useMap<K, T>(initialValue?: Iterable<readonly [K, T]>) {
  // getInitValue 函数返回一个新的 Map 实例，如果有初始值，将其传递给 Map 构造函数。
  const getInitValue = () => {
    return initialValue === undefined ? new Map() : new Map(initialValue)
  }

  // 使用 useState 创建一个可变的 Map 实例，并将 getInitValue 函数传递给 useState。
  const [map, setMap] = useState<Map<K, T>>(() => getInitValue())

  // 定义 set 函数，用于添加键值对。 可以理解为add函数
  const set = (key: K, entry: T) => {
    setMap((prev) => {
      console.log(prev)
      const temp = new Map(prev)
      temp.set(key, entry)
      return temp
    })
  }

  // 定义 setAll 函数，用于添加多个键值对.
  const setAll = (newMap: Iterable<readonly [K, T]>) => {
    setMap(new Map(newMap))
  }

  // 定义 remove 函数，用于删除指定键的键值对。
  const remove = (key: K) => {
    setMap((prev) => {
      const temp = new Map(prev)
      temp.delete(key)
      return temp
    })
  }

  // 定义 reset 函数，用于将 Map 重置为
  const reset = () => setMap(getInitValue())

  const get = (key: K) => map.get(key)

  return [
    map,
    {
      set: useMemoizedFn(set),
      setAll: useMemoizedFn(setAll),
      remove: useMemoizedFn(remove),
      reset: useMemoizedFn(reset),
      get: useMemoizedFn(get),
    },
  ] as const
}

export default useMap
