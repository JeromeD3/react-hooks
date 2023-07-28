import useRequest from '../../hooks/useRequest/useRequest'

function getName(_: any = '') {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('获取用户名失败'))
    }, 2000)
  })
}
function App() {
  const {
    data: name,
    loading,
    run,
  } = useRequest(getName, {
    retryCount: 3,
    retryInterval: 1000,
  })
  return (
    <>
      <input onChange={(e) => run(e.target.value)} />
      {loading ? '加载中' : name ? <div>用户名: {name}</div> : null}
    </>
  )
}
export default App
