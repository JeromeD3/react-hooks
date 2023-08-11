import { useRef, useState } from 'react'
import useClickAway from '..'

export default () => {
  const [counter, setCounter] = useState(0)
  const ref = useRef<HTMLButtonElement>(null)
  
  useClickAway(() => {
    setCounter((s) => s + 1)
  }, ref)

  return (
    <div>
      <button ref={ref} type="button">
        box
      </button>
      <p>counter: {counter}</p>
    </div>
  )
}
