import { useRef } from 'react'
import { useUpdateEffect } from '../../Effect/useUpdateEffect'
const useAutoRunPlugin = (
  fetchInstance: any,
  { manual, ready = true, defaultParams = [], refreshDeps = [], refreshDepsAction }: any
) => {
  const hasAutoRun = useRef(false)
  hasAutoRun.current = false
  console.log('插件执行', hasAutoRun.current)

  useUpdateEffect(() => {
    //  如果没有传ready的话，默认是发起请求的
    if (!manual && ready) {
      hasAutoRun.current = true
      console.log('ready执行')
      fetchInstance.run(...defaultParams) // 这里调run是为了自动执行
    }
  }, [ready])

  useUpdateEffect(() => {
    console.log('refreshDeps执行', hasAutoRun.current)
    if (hasAutoRun.current) {  // 这里理解为能自动执行，就不用重新刷新了，这样减少了一次请求，盲猜这里是为了和ready配合使用的，如果ready状态切换，这里也会执行，所以加一个if判断就不会再次请求了
      // 初始化的时候如果能发起请求，就不执行--> 相当于初始化少了一步自动刷新
      return
    }
    // 然后当依赖更新后，hasAuto重新赋值为false，第一个hook不会执行，然后不走默认发起请求逻辑，走重新刷新的逻辑
    if (!manual) {
      hasAutoRun.current = true
      if (refreshDepsAction) {
        refreshDepsAction()
      } else {
        fetchInstance.refresh()
      }
    }
  }, [...refreshDeps])

  return {
    onBefore: () => {
      if (!ready) {
        return {
          stopNow: true,
        }
      }
    },
  }
}

useAutoRunPlugin.onInit = ({ ready = true, manual }: any) => {
  return {
    loading: !manual && ready,
  }
}

export default useAutoRunPlugin
