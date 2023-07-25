import { useState } from 'react'
import { useUpdateEffect } from '../hooks/Effect/useUpdateEffect'

const UseUpdateEffect = () => {
  const [count, setCount] = useState(0)
  const [state, setState] = useState(false)
  useUpdateEffect(() => {
    setTimeout(() => {
      setState(true)
    }, 1000)
    console.log('useUpdateEffect')
    return () => {
      console.log('useUpdateEffect unmount')
    }
  }, [count])
  return (
    <>
      <h1>{count}</h1>
      <button type="button" onClick={() => setCount((c) => c + 1)}>
        reRender
      </button>

      <h1>{state && <div>useUpdateEffect</div>}</h1>
    </>
  )
}

export default UseUpdateEffect
