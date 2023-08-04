import useRequest from '../../hooks/useRequest/useRequest'

function getName(suffix) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(suffix)
    }, 0)
  })
}
function App() {
  const {
    data: name,
    loading,
    run,
  }: any = useRequest(getName, {
    manual: true,
    debounceWait: 1000,
  })
  return (
    <>
      {loading ? '加载中' : name ? <div>用户名:{name}</div> : null}
      <input onChange={(e) => run(e.target.value)} />
    </>
  )
}
export default App
