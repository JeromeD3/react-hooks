import { useState } from 'react'
import useRequest from '../../hooks/useRequest/useRequest'

/**
 * 先获取缓存的数据，然后再去请求接口，最后再更新数据
 */
let counter = 0
function getName(keyword = '') {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        time: new Date().toLocaleTimeString(),
        data: keyword + ++counter,
      })
    }, 2000)
  })
}

function User() {
  const { data, loading, params, run }: any = useRequest(getName, {
    cacheKey: 'time',
    staleTime: 0, // 每隔5秒更新一次数据
  })
  const [keyword, setKeyword] = useState(params[0] || '')
  if (!data && loading) {
    return <p>加载中...</p>
  }
  return (
    <>
      <div>
        <input value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        <button
          onClick={() => {
            run(keyword)
          }}
        >
          获取用户名
        </button>
      </div>
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
      {visible && (
        <>
          <User />
          {/* <hr /> */}
          {/* <User /> */}
        </>
      )}
    </div>
  )
}
export default App
