import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react'
import { BasicTarget, getTargetElement } from '../../../utils/domTarget'
import { useLatest } from '../../Advanced/useLatest'
import useSize from '../../Dom/useSize'
import { useUpdateEffect } from '../../Effect/useUpdateEffect'
import useEventListener from '../../Dom/useEventListener'
import useMemoizedFn from '../../Advanced/useMemoizedFn'

export const isNumber = (value: unknown): value is number => typeof value === 'number'

type ItemHeight<T> = (index: number, data: T) => number
export interface Options<T> {
  containerTarget: BasicTarget
  wrapperTarget: BasicTarget
  itemHeight: number | ItemHeight<T>
  overscan?: number
}

const useVirtualList = <T = any>(list: T[], options: Options<T>) => {
  const { containerTarget, wrapperTarget, itemHeight, overscan = 5 } = options

  const itemHeightRef = useLatest(itemHeight) // 获取单个元素高度

  const size = useSize(containerTarget) // 获取容器宽高

  const scrollTriggerByScrollToFunc = useRef(false) // 是否是 scrollTo 触发的滚动

  const [targetList, setTargetList] = useState<{ index: number; data: T }[]>([])

  const [wrapperStyle, setWrapperStyle] = useState<CSSProperties>({})

  /**
   * 获取可视区域内的物品数量，例如可视区域高度为 100，每个物品高度为 10，那么可视区域内的物品数量为 10 个
   */
  const getVisibleCount = (containerHeight: number, fromIndex: number) => {
    if (isNumber(itemHeightRef.current)) {
      console.log('可视区域内的物品数量', Math.ceil(containerHeight / itemHeightRef.current))
      return Math.ceil(containerHeight / itemHeightRef.current) // 向上舍入
    }

    let sum = 0
    let endIndex = 0
    for (let i = fromIndex; i < list.length; i++) {
      const height = itemHeightRef.current(i, list[i])
      sum += height
      endIndex = i
      if (sum >= containerHeight) {
        break
      }
    }
    return endIndex - fromIndex
  }

  /**
   * 计算偏移量, 即使用滚动条滚动到了第几个物品
   */
  const getOffset = (scrollTop: number) => {
    console.log('滚动高度', scrollTop)

    if (isNumber(itemHeightRef.current)) {
      console.log(Math.floor(scrollTop / itemHeightRef.current) + 1 + '个')
      return Math.floor(scrollTop / itemHeightRef.current) + 1 // 向下舍入
    }

    // 下面这种情况是 itemHeight 是一个函数的情况
    console.log('需要计算：', itemHeightRef)
    let sum = 0
    let offset = 0
    for (let i = 0; i < list.length; i++) {
      const height = itemHeightRef.current(i, list[i])
      sum += height
      if (sum >= scrollTop) {
        offset = i
        break
      }
    }
    return offset + 1
  }

  // 获取距离顶部的距离
  const getDistanceTop = (index: number) => {
    if (isNumber(itemHeightRef.current)) {
      const height = index * itemHeightRef.current
      console.log('getDistanceTop', height)
      return height
    }
    const height = list.slice(0, index).reduce((sum, _, i) => sum + (itemHeightRef.current as ItemHeight<T>)(i, list[i]), 0)
    console.log('getDistanceTop', height)

    return height
  }

  // 计算总高度
  const totalHeight = useMemo(() => {
    if (isNumber(itemHeightRef.current)) {
      return list.length * itemHeightRef.current
    }
    return list.reduce((sum, _, index) => sum + (itemHeightRef.current as ItemHeight<T>)(index, list[index]), 0)
  }, [list])

  // 计算可视区域内的物品
  const calculateRange = () => {
    const container = getTargetElement(containerTarget)

    if (container) {
      const { scrollTop, clientHeight } = container
      console.log('calculateRange, 滚动条高度', scrollTop, clientHeight)

      const offset = getOffset(scrollTop) // 当前滚动到了第几个物品
      const visibleCount = getVisibleCount(clientHeight, offset) // 可视区域内的物品数量。一般来说

      const start = Math.max(0, offset - overscan) //
      console.log('start', start)
      const end = Math.min(list.length, offset + visibleCount + overscan)
      console.log('end', end) // end-start  = 当前页面上有多少个dom

      const offsetTop = getDistanceTop(start)
      console.log('offsetTop', offsetTop)
      // 修改样式
      setWrapperStyle({
        height: totalHeight - offsetTop + 'px',
        marginTop: offsetTop + 'px',
      })

      // 添加/删除元素
      setTargetList(
        list.slice(start, end).map((ele, index) => ({
          data: ele,
          index: index + start,
        }))
      )
    }
  }

  // 主要是更新内部容器样式 更新的时候执行 -->  滚动的时候更新样式，防止滚动条跳动
  useUpdateEffect(() => {
    const wrapper = getTargetElement(wrapperTarget) as HTMLElement
    console.log('useUpdateEffect, 内部样式变化', wrapper)

    if (wrapper) {
      Object.keys(wrapperStyle).forEach((key) => (wrapper.style[key] = wrapperStyle[key]))
    }
  }, [wrapperStyle])

  useEffect(() => {
    if (!size?.width || !size?.height) {
      return
    }
    calculateRange()
  }, [size?.width, size?.height, list])

  // 给外部容器添加滚动事件
  useEventListener(
    'scroll',
    (e) => {
      if (scrollTriggerByScrollToFunc.current) {
        console.log("执行谢谢谢谢谢谢谢谢谢谢谢谢谢谢谢谢")
        scrollTriggerByScrollToFunc.current = false
        return
      }
      e.preventDefault() // 阻止默认事件
      calculateRange() // 滚动时重新计算
    },
    {
      target: containerTarget,
    }
  )

  // 快速滚动到指定位置
  const scrollTo = (index: number) => {
    const container = getTargetElement(containerTarget) // 获取容器
    if (container) {
      scrollTriggerByScrollToFunc.current = true // 正在滚动
      container.scrollTop = getDistanceTop(index)
      calculateRange()
    }
  }

  return [targetList, useMemoizedFn(scrollTo)] as const
}

export default useVirtualList
