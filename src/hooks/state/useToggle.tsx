import { useState, useMemo } from 'react'
/**
 * 实现一个用于在两个状态值间切换的 Hook！
 *
 */
function useToggle(defaultValue: any, reverseValue?: any) {
  const [state, setState] = useState(defaultValue)
  const action = useMemo(() => {
    // --- 下面是补全的代码 ---
    // 由于reverseValue参数可选，所以并不一定存在右值，可能需要我们自行对左值取反

    const reverseValueOrigin = reverseValue === undefined ? !defaultValue : reverseValue
    const set = (v: any) => {
      setState(v)
    }
    const setLeft = () => {
      setState(defaultValue)
    }
    const setRight = () => {
      setState(reverseValue)
    }

    const toggle = () => {
      const newValue = (s: any) => (s === defaultValue ? reverseValueOrigin : defaultValue)
      setState(newValue)
    }

    // useMemo 返回函数？
    return {
      setLeft,
      setRight,
      set,
      toggle,
    }
  }, [])
  return [state, action]
}

export default useToggle
