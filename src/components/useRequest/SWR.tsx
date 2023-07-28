import { useState } from 'react'
import useRequest from '../../hooks/useRequest/useRequest'

/**
 * 先获取缓存的数据，然后再去请求接口，最后再更新数据
 */
let counter = 0
function getName() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        time: new Date().toLocaleTimeString(),
        data: `test` + ++counter,
      })
    }, 2000)
  })
}

function User() {
  const { data, loading }: any = useRequest(getName, {
    cacheKey: 'time',
    staleTime: 2000,// 每隔5秒更新一次数据
  })
  if (!data && loading) {
    return <p>加载中...</p>
  }
  return (
    <>
      <p>后台加载中: {loading ? 'true' : 'false'}</p>
      <p>最近的请求时间: {data?.time}</p>
      <p>{data?.data}</p>
    </>
  )
}
function App() {
  const [visible, setVisible] = useState(true)
  return (
    <div>
      <button type="button" onClick={() => setVisible(!visible)}>
        {visible ? '隐藏' : '显示'}
      </button>
      {visible && <User />}
    </div>
  )
}
export default App
