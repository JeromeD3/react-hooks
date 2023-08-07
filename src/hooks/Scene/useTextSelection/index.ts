/**
 * 应用场景：滑词翻译
 * 实时获取用户当前选取的文本内容及位置
 */

import { useRef, useState } from 'react'
import { BasicTarget, getTargetElement } from '../../../utils/domTarget'
import useEffectWithTarget from '../../../utils/useEffectWithTarget'

interface Rect {
  top: number
  left: number
  bottom: number
  right: number
  height: number
  width: number
}

interface State extends Rect {
  text: string
}

const initRect: Rect = {
  top: NaN,
  left: NaN,
  bottom: NaN,
  right: NaN,
  height: NaN,
  width: NaN,
}

const initState: State = {
  text: '',
  ...initRect,
}

function useTextSelection(target?: BasicTarget<Document | Element>): State {
  const [state, setState] = useState(initState)

  const stateRef = useRef(state)
  const isInRangeRef = useRef(false) // 判断dom是否在可以选择的范围内, 防止点击其他地方时也触发mouseup事件
  stateRef.current = state

  useEffectWithTarget(
    () => {
      // 获取目标元素
      const el = getTargetElement(target, document)
      if (!el) {
        return
      }

      // 任意点击都需要清空之前的 range： 鼠标按下
      const mousedownHandler = (e) => {
        if (!window.getSelection) return
        console.log('鼠标按下：', stateRef.current)
        if (stateRef.current.text) { // 有的话就清空
          setState({ ...initState })
        }
        isInRangeRef.current = false
        // 返回一个 Selection 对象，表示用户选择的文本范围或光标的当前位置
        const selObj = window.getSelection()

        if (!selObj) return
        selObj.removeAllRanges()
        isInRangeRef.current = el.contains(e.target)
      }

      // 鼠标抬起
      const mouseupHandler = () => {

        let selObj: Selection | null = null
        let text = ''
        let rect = initRect
        if (!window.getSelection) return
        // 返回一个 Selection 对象，表示用户选择的文本范围或光标的当前位置
        selObj = window.getSelection()
        // 转为字符串
        text = selObj ? selObj.toString() : ''
        if (text && isInRangeRef.current) {
          // 获取文本位置信息并设置
          rect = getRectFromSelection(selObj)
          setState({ ...state, text, ...rect })
        }
      }

      el.addEventListener('mouseup', mouseupHandler)

      document.addEventListener('mousedown', mousedownHandler)

      return () => {
        el.removeEventListener('mouseup', mouseupHandler)
        document.removeEventListener('mousedown', mousedownHandler)
      }
    },
    [],
    target
  )

  return state
}

function getRectFromSelection(selection: Selection | null): Rect {
  if (!selection) {
    return initRect
  }
  // rangeCount：返回选区 (selection) 中 range 对象数量的只读属性
  if (selection.rangeCount < 1) {
    return initRect
  }
  // 返回一个包含当前选区内容的区域对象
  console.log('selection', selection.getRangeAt(0).getBoundingClientRect())
  const range = selection.getRangeAt(0)
  const { height, width, top, left, right, bottom } = range.getBoundingClientRect()
  return {
    height,
    width,
    top,
    left,
    right,
    bottom,
  }
}

export default useTextSelection
