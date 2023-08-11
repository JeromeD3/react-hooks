import type { DependencyList, EffectCallback, useEffect, useLayoutEffect } from 'react'
import { useRef } from 'react'
import type { BasicTarget } from './domTarget'
import { getTargetElement } from './domTarget'
import { depsAreSame } from '../hooks/Advanced/useCreation'
import useUnmount from '../hooks/LifeCycle/useUnmount'

/**
 * 每次都会执行
 */
const createEffectWithTarget = (useEffectType: typeof useEffect | typeof useLayoutEffect) => {
  // 不传递依赖，状态改变都会执行一次
  const useEffectWithTarget = (effect: EffectCallback, deps: DependencyList, target: BasicTarget<any> | BasicTarget<any>[]) => {
    const hasInitRef = useRef(false)

    const lastElementRef = useRef<(Element | null)[]>([])
    const lastDepsRef = useRef<DependencyList>([])

    const unLoadRef = useRef<any>()
    console.log('createEffectWithTarget')
    // 每次都会执行
    useEffectType(() => {
      const targets = Array.isArray(target) ? target : [target]
      const els = targets.map((item) => getTargetElement(item))
      // init run , 主要将依赖和元素记录下来，然后执行一遍effect
      if (!hasInitRef.current) {
        hasInitRef.current = true
        lastElementRef.current = els
        lastDepsRef.current = deps

        unLoadRef.current = effect()
        return
      }


      // 中途改变依赖，先卸载之前的effect
      if (els.length !== lastElementRef.current.length || !depsAreSame(els, lastElementRef.current) || !depsAreSame(deps, lastDepsRef.current)) {
        console.log("中途改变依赖，先卸载之前的effect")
        unLoadRef.current?.()
        console.log(unLoadRef)
        lastElementRef.current = els
        lastDepsRef.current = deps
        unLoadRef.current = effect()
      }
    })

    useUnmount(() => {
      unLoadRef.current?.()
      // for react-refresh
      hasInitRef.current = false
    })
  }

  return useEffectWithTarget
}

export default createEffectWithTarget
