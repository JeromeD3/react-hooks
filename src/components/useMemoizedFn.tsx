import { memo, useCallback, useRef, useState } from 'react'
import useMemoizedFn from '../hooks/Advanced/UseMemoizedFn'

export default () => {
  const [count, setCount] = useState(0)

  const callbackFn = useCallback(() => {
    console.log(`Current count is ${count}`)
  }, [count])

  const memoizedFn = useMemoizedFn(() => {
    console.log(`Current count is ${count}`)
  })

  return (
    <>
      <p>count: {count}</p>
      <button
        type="button"
        onClick={() => {
          setCount((c) => c + 1)
        }}
      >
        Add Count
      </button>

      <p>You can click the button to see the number of sub-component renderings</p>

      <div style={{ marginTop: 32 }}>
        <h3>Component with useCallback function:</h3>
        {/* use callback function, ExpensiveTree component will re-render on state change */}
        <ExpensiveTree showCount={callbackFn} />
      </div>

      <div style={{ marginTop: 32 }}>
        <h3>Component with useMemoizedFn function:</h3>
        {/* use memoized function, ExpensiveTree component will only render once */}
        <ExpensiveTree showCount={memoizedFn} />
      </div>
    </>
  )
}

// some expensive component with React.memo
const ExpensiveTree = memo<{ [key: string]: any }>(({ showCount }) => {
  // 声明引用，保持每次渲染的值
  const renderCountRef = useRef(0)
  renderCountRef.current += 1

  return (
    <div>
      <p>Render Count: {renderCountRef.current}</p>
      <button type="button" onClick={showCount}>
        showParentCount
      </button>
    </div>
  )
})
