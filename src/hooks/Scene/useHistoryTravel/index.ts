import { useRef, useState } from 'react'
import useMemoizedFn from '../../Advanced/useMemoizedFn'
import { isNumber } from 'lodash'

interface IData<T> {
  present?: T
  past: T[]
  future: T[]
}

// 主要用于计算索引值，这个函数的作用是什么呢？ 因为步骤他是大于0的，而索引是从0开始的，所以需要这个函数用来转化一下
const dumpIndex = <T>(step: number, arr: T[]) => {
  let index =
    step > 0
      ? step - 1 // move forward
      : arr.length + step; // move backward
    
  // 限制 index 的范围,如果索引超出范围，就返回最后一个，反之返回第一个
  if (index >= arr.length - 1) {
    index = arr.length - 1;
  }
  if (index < 0) {
    index = 0;
  }

  return index;
};

const split = <T>(step: number, targetArr: T[]) => {
  const index = dumpIndex(step, targetArr); // 获取
  return {
    _current: targetArr[index],
    _before: targetArr.slice(0, index),
    _after: targetArr.slice(index + 1),
  };
};


/**
 * 应用场景 : 撤销/重做 / 或者步骤条，上一步，下一步 类似于这种
 */
function useHistoryTravel<T>(initialValue?: T, maxLength: number = 0) {
  const [history, setHistory] = useState<IData<T | undefined>>({
    present: initialValue, // 当前值
    past: [], // 可回退历史队列
    future: [], // 可前进历史队列
  })

  const { present, past, future } = history

  const initialValueRef = useRef(initialValue) // 这里保存初始值，用于 reset

  // 重置
  const reset = (...params: any[]) => {
    const _initial = params.length > 0 ? params[0] : initialValueRef.current
    initialValueRef.current = _initial

    setHistory({
      present: _initial, // 重置到初始值或提供一个新的初始值
      future: [],
      past: [],
    })
  }

  // 设置 value 值，都是往可回退的队列里添加值
  const updateValue = (val: T) => {
    const _past = [...past, present] // 把当前值保存到过去中，因为你已经更新了值，所以present已经是过去的

    const maxLengthNum = isNumber(maxLength) ? maxLength : Number(maxLength)

    // 有传历史记录最大长度 && 可回退历史长度大于最大长度
    if (maxLengthNum > 0 && _past.length > maxLengthNum) {
      // 删除第一个记录
      _past.splice(0, 1)
    }

    setHistory({
      present: val,
      future: [], // 置空可前进历史队列 ，因为你已经更新了值，所以present已经是最新的
      past: _past,
    })
    console.log("当前的值",{present, past, future})
  }

  // 前进，默认前进一步（调用 split 函数，第二个参数传 future）
  const _forward = (step: number = 1) => {
    if (future.length === 0) {
      return
    }
    const { _before, _current, _after } = split(step, future)
    setHistory({
      // 旧状态，加上现在以及刚过去的
      past: [...past, present, ..._before],
      present: _current,
      future: _after,
    })
  }

  // 后退，默认后退一步（调用 split 函数，第二个参数传 past
  const _backward = (step: number = -1) => {
    if (past.length === 0) {
      return
    }

    const { _before, _current, _after } = split(step, past)
    setHistory({
      past: _before,
      present: _current,
      future: [..._after, present, ...future],
    })
  }

  // 前进步数
  const go = (step: number) => {
    const stepNum = isNumber(step) ? step : Number(step)
    if (stepNum === 0) {
      return
    }
    if (stepNum > 0) {
      return _forward(stepNum)
    }
    _backward(stepNum)
  }

  return {
    value: present, // 当前值
    backLength: past.length, // 可回退历史长度
    forwardLength: future.length, // 可前进历史长度
    setValue: useMemoizedFn(updateValue), // 设置 value
    go: useMemoizedFn(go), // 前进步数, step < 0 为后退， step > 0 时为前进
    back: useMemoizedFn(() => {
      go(-1) // 向后回退一步
    }),
    forward: useMemoizedFn(() => {
      go(1) // 向前前进一步
    }),
    reset: useMemoizedFn(reset), // 重置到初始值，或提供一个新的初始值
  }
}
export default useHistoryTravel
