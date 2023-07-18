import { useState } from 'react'
import useDebounceFn from '../hooks/Effect/useDebounceFn'

export default () => {
  const [cnt, setCnt] = useState(0) // TODO: 实现这个hook
  const { run } = useDebounceFn(
    () => {
      setCnt(cnt + 1)
      console.log('cnt: ', cnt)
    },
    { wait: 500 }
  )
  return (
    <div>
      <p>cnt: {cnt} </p>
      <button type="button" onClick={run}>
        点点我！
      </button>
    </div>
  )
}
