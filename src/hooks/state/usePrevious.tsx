import { useRef } from 'react'
// 默认的比较方法，判定前后状态是否一致
const defaultShouldUpdate = (a: any, b: any) => !Object.is(a, b)
// react 也是用Object.is来比较的

function usePrevious(state: any, shouldUpdate = defaultShouldUpdate) {
  // 使用useRef 避免了因为修改状态导致组件发生额外的渲染。
  const prevRef = useRef()
  const curRef = useRef()
  if (shouldUpdate(curRef.current, state)) {
    prevRef.current = curRef.current
    curRef.current = state
  }
  return prevRef.current
}
export default usePrevious
