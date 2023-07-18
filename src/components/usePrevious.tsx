import { useState } from 'react'
import usePrevious from '../hooks/state/usePrevious'

export default () => {
  const [count, setCount] = useState(0) // TODO: 实现这个hook
  const previous = usePrevious(count)
  return (
    <>
      <div>现在的: {count}</div>
      <div>上一次的: {previous}</div>
      <button onClick={() => setCount(count + 1)}>+1 </button>
    </>
  )
}
