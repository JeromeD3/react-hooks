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
      console.log('改变依赖第一个条件:', els.length !== lastElementRef.current.length)
      console.log('改变依赖第2个条件:', !depsAreSame(els, lastElementRef.current))
      console.log('改变依赖第2个条件:', !depsAreSame(deps, lastDepsRef.current), deps, lastDepsRef.current)
      // 使用depsAreSame的时候，如果传递的是对象，他们会判断引用的
      // ## 一些使用心得
      // useEffect传递的deps数组，因为数组是引用类型，而每次渲染的时候，deps数组都是新的，
      // 按道理来说应该每次都会执行useEffect的回调函数，但是实际上，useEffect的回调函数只会在deps数组发生变化的时候才会执行，
      // 这是因为React内部对deps数组进行了浅比较，如果发现deps数组的值和上一次的一样，就不会执行useEffect的回调函数，
      // 这样做的目的是为了避免不必要的重复执行，提高性能。

      // 所以useEffect的deps，本来是个引用类型，如果里面还有引用类型的话，可以将里面的引用类型用ref来包裹
      if (els.length !== lastElementRef.current.length || !depsAreSame(els, lastElementRef.current) || !depsAreSame(deps, lastDepsRef.current)) {
        console.log('中途改变依赖，先卸载之前的effect')
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
