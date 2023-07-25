import { useRef, useState } from 'react'
import useCreation from '../hooks/Advanced/useCreation'

class Foo {
  constructor() {
    console.log('I will be called only once')
    this.data = Math.random()
  }

  data: number
}

export default function () {
  const [count, setCount] = useState(1)
  // const foo = useRef(new Foo())
  const foo = useCreation(() => new Foo(), [])
  return (
    <>
      <p>{foo.data}</p>
      <p>{count}</p>
      <button
        type="button"
        onClick={() => {
          console.log('执行了')
          setCount(count + 1)
        }}
      >
        Rerender
      </button>
    </>
  )
}
