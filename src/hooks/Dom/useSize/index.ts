import ResizeObserver from 'resize-observer-polyfill'
import { BasicTarget, getTargetElement } from '../../../utils/domTarget'
import useRafState from '../../state/useRafState'
import useIsomorphicLayoutEffectWithTarget from '../../../utils/useIsomorphicLayoutEffectWithTarget'

type Size = { width: number; height: number }

// 给一个dom容器，返回他的size
function useSize(target: BasicTarget): Size | undefined {
  // 
  const [state, setState] = useRafState<Size | undefined>(() => {
    const el = getTargetElement(target)
    return el ? { width: el.clientWidth, height: el.clientHeight } : undefined
  })

  // 渲染前同步执行，防止闪烁
  useIsomorphicLayoutEffectWithTarget(
    () => {
      const el = getTargetElement(target)

      if (!el) {
        return
      }

      const resizeObserver = new ResizeObserver((entries) => {
        console.log('entries', entries)
        entries.forEach((entry) => {
          const { clientWidth, clientHeight } = entry.target
          setState({ width: clientWidth, height: clientHeight })
        })
      })
      resizeObserver.observe(el)
      return () => {
        resizeObserver.disconnect()
      }
    },
    [],
    target
  )

  return state
}

export default useSize
