import { useState } from 'react'
import { useUpdateEffect } from '../hooks/Effect/useUpdateEffect'

const UseUpdateEffect = () => {
  const [stateCount, setState] = useState(false)
  useUpdateEffect(() => {
    setTimeout(() => {
      setState(true)
    }, 1000)
    console.log('useUpdateEffect')
    return () => {
      console.log('useUpdateEffect unmount')
    }
  }, [])
  return (
    <>
      <button onClick={() => setState(!stateCount)}>change</button>
      <h1>{stateCount && <div>useUpdateEffect</div>}</h1>
    </>
  )
}

export default UseUpdateEffect
