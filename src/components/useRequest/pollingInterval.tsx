/**
 * 轮询，不停发请求
 */

import useRequest from '../../hooks/useRequest/useRequest'
let count: any = 0
function getUsername() {
  console.log('polling getUsername')
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(++count)
    }, 1000)
  })
}

export default () => {
  const { data, loading, run, cancel } = useRequest(getUsername, {
    pollingInterval: 1000,
    pollingWhenHidden: false,
  })

  return (
    <>
      <p>Username: {loading ? 'Loading' : data}</p>
      <button type="button" onClick={run}>
        start
      </button>
      <button type="button" onClick={cancel} style={{ marginLeft: 16 }}>
        stop
      </button>
    </>
  )
}
