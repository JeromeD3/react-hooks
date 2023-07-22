import { useMemo } from 'react'
import useToggle from './useToggle'

export interface Actions {
  setTrue: () => void
  setFalse: () => void
  set: (value: boolean) => void
  toggle: () => void
}
// 控制开关状态：用 useBoolean 来管理某个开关的状态，例如弹窗、抽屉、菜单等的显示或隐藏状态。
// 处理复杂逻辑：用 useBoolean 来简化某些复杂的状态逻辑处理，例如异步加载数据时的 loading 状态。
// 处理多选状态：用 useBoolean 来管理多个选项的选中状态，例如多选框组件。



export default function useBoolean(defaultValue = false): [boolean, Actions] {
  const [state, { toggle, set }] = useToggle(!!defaultValue)

  const actions: Actions = useMemo(() => {
    const setTrue = () => set(true)
    const setFalse = () => set(false)
    return {
      toggle,
      set: (v) => set(!!v),
      setTrue,
      setFalse,
    }
  }, [])

  return [state, actions]
}
