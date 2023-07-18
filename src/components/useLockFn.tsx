import { useCallback, useMemo, useState } from 'react'
import useLockFn from '../hooks/Effect/useLockFn'

function mockApiRequest() {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, 2000)
  })
}
export default () => {
  // 传入一个异步函数，返回一个最大并发数为1的异步函数
  const [count, setCount] = useState(0)
  const [name, setName] = useState('b')

  function mock() {
    const res = count + 1
    console.log('大量运输', count + 1)
    console.log(res);
    
    return res
  }
  const memomock = useCallback(mock, [count])
  console.log(memomock);
  
  const submit = useLockFn(async () => {
    console.log('开始了')
    await mockApiRequest()
    console.log('结束了')
  })

  return (
    <>
      <button onClick={submit}>Submit2</button>
      <h1>{count}</h1>
      <h1>大量运算：{memomock()}</h1>
      <button>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </button>
      <button onClick={() => setCount(count + 1)}>Count+1</button>
    </>
  )
}
