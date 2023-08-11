// import 'intersection-observer';
import { useRef, useState } from 'react'
import { BasicTarget, getTargetElement } from '../../../utils/domTarget'
import useEffectWithTarget from '../../../utils/useEffectWithTarget'

type CallbackType = (entry: IntersectionObserverEntry) => void

export interface Options {
  rootMargin?: string
  threshold?: number | number[] // 设置交叉比例， 相当于一个阈值，达到多少比例就执行回调函数
  root?: BasicTarget<Element>
  callback?: CallbackType
}

/**
 *
 *
 */
function useInViewport(target: BasicTarget | BasicTarget[], options?: Options) {
  const { callback, ...option } = options || {}

  const [state, setState] = useState<boolean>()
  const [ratio, setRatio] = useState<number>()

  useEffectWithTarget(
    () => {
      const targets = Array.isArray(target) ? target : [target]
      console.log('targets', targets);
      
      const els = targets.map((element) => getTargetElement(element)).filter(Boolean) // 过滤undefined

      if (!els.length) {
        return
      }

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            setRatio(entry.intersectionRatio)
            setState(entry.isIntersecting)
            callback?.(entry)
          }
        },
        {
          ...option,
          root: getTargetElement(options?.root),
        }
      )

      // 为每个目标元素创建观察者
      els.forEach((el) => {
        if (el) {
          observer.observe(el)
        }
      })

      return () => {
        observer.disconnect()
      }
    },
    [options?.rootMargin, options?.threshold, callback],
    target
  )

  return [state, ratio] as const
}

export default useInViewport
