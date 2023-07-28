import useRequest from '../../hooks/useRequest/useRequest'

let counter = 0
function getName() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`每五秒钟更新一次数据` + ++counter)
    }, 1000)
  })
}
function App() {
  const { data: name, loading } = useRequest(getName, {
    refreshOnWindowFocus: true,
    focusTimespan: 5000,
  })
  return (
    <>
      <h1>切换屏幕自动刷新---</h1>
      {loading ? '加载中' : name ? <div>用户名: {name}</div> : null}
    </>
  )
}
export default App
