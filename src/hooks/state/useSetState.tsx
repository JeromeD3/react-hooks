// 需要在组件中管理一些复杂的状态，而这些状态不方便使用单独的useState来管理。
// 需要在组件中管理的状态对象比较大，但是每次更新时只需要修改其中的一小部分属性。
// 需要在组件中管理的状态对象需要被多个子组件使用，并且这些子组件需要更新其中的一部分属性。

import { useCallback, useState } from 'react'

function isFunction(fn: any) {
  return typeof fn === 'function'
}

const useSetState = (initialState: any) => {
  const [state, setState] = useState(initialState)

  const setMergeState = useCallback((patch: any) => {
    console.log('执行',patch)

    setState((prevState: any) => {
      const newState = isFunction(patch) ? patch(prevState) : patch
      return newState ? { ...prevState, ...newState } : prevState
    })
  }, [])

  return [state, setMergeState]
}

export default useSetState
