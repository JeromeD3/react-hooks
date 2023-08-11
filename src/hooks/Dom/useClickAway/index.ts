import { BasicTarget, getTargetElement } from '../../../utils/domTarget'
import getDocumentOrShadow from '../../../utils/getDocumentOrShadow'
import useEffectWithTarget from '../../../utils/useEffectWithTarget'
import { useLatest } from '../../Advanced/useLatest'

type DocumentEventKey = keyof DocumentEventMap

// 思路的话，就是在全局绑定一个事件，然后判断点击的元素是否在目标元素内，如果不在，就执行回调
export default function useClickAway<T extends Event = Event>(
  onClickAway: (event: T) => void,
  target: BasicTarget | BasicTarget[],
  eventName: DocumentEventKey | DocumentEventKey[] = 'click' // 默认为 click
) {
  const onClickAwayRef = useLatest(onClickAway)

  console.log('onClickAwayRef')
  useEffectWithTarget(
    () => {
      const handler = (event: any) => {
        const targets = Array.isArray(target) ? target : [target]

        // 判断目标元素是否在点击元素内
        if (
          targets.some((item) => {
            const targetElement = getTargetElement(item)
            return !targetElement || targetElement.contains(event.target)
          })
        ) {
          return
        }
        onClickAwayRef.current(event)
      }

      const documentOrShadow = getDocumentOrShadow(target)

      const eventNames = Array.isArray(eventName) ? eventName : [eventName]
      // 绑定事件
      eventNames.forEach((event) => documentOrShadow.addEventListener(event, handler))

      return () => {
        eventNames.forEach((event) => documentOrShadow.removeEventListener(event, handler))
      }
    },
    Array.isArray(eventName) ? eventName : [eventName],
    target
  )
}
