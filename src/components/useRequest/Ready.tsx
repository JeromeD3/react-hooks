import useToggle from '../../hooks/state/useToggle'
import useRequest from '../../hooks/useRequest/useRequest'

function getUsername() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Math.random() * 10)
    }, 1000)
  })
}

export default () => {
  const [ready, { toggle }] = useToggle(false)

  const { data, loading, run } = useRequest(getUsername, {
    manual: true, // 手动模式
    ready,
  })

  return (
    <>
      <p>
        Ready: {JSON.stringify(ready)}
        <button onClick={toggle} style={{ marginLeft: 16 }}>
          Toggle Ready
        </button>
        <button type="button" onClick={run}>
          run
        </button>
      </p>
      <p>Username: {loading ? 'Loading' : data}</p>
    </>
  )
}
