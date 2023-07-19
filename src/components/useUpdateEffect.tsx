import { useState } from 'react'
import { useUpdateEffect } from '../hooks/Effect/useUpdateEffect'

const UseUpdateEffect = () => {
  const [state, setState] = useState(false)
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
      <h1>{state}</h1>
      <div>useUpdateEffect</div>
    </>
  )
}
export default UseUpdateEffect
