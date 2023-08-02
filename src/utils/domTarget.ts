import type { MutableRefObject } from 'react'
import { isBrowser } from '../hooks/useRequest/utils/isBrowser'

export const isFunction = (value: unknown): value is (...args: any) => any => typeof value === 'function'

type TargetValue<T> = T | undefined | null

type TargetType = HTMLElement | Element | Window | Document

// 目标类型， 可以是一个element，也可以是一个函数，或者是一个ref
export type BasicTarget<T extends TargetType = Element> = (() => TargetValue<T>) | TargetValue<T> | MutableRefObject<TargetValue<T>>

/**
 * 返回目标元素，如果是函数，就执行函数，如果是ref，就返回ref.current
 *  */
export function getTargetElement<T extends TargetType>(target: BasicTarget<T>, defaultElement?: T) {
  if (!isBrowser) {
    return undefined
  }

  if (!target) {
    return defaultElement
  }

  let targetElement: TargetValue<T>

  if (isFunction(target)) {
    targetElement = target()
  } else if ('current' in target) {
    targetElement = target.current
  } else {
    targetElement = target
  }

  return targetElement
}
