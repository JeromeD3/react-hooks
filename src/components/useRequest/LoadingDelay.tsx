// 避免了页面展示 Loading... 的情况

// 测试了一下--> loadingDelay也是需要时间去执行的，所以如果最后返回的是loading，最后花费的时间是 loadingDelay + 获取数据的时间
import useRequest from '../../hooks/useRequest/useRequest'

function getUsername(prefix: any): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(prefix + 'Jack')
    }, 2000)
  })
}
function getMathRandom(): number {
  return Math.random()
}
export default () => {
  const action = useRequest(getUsername, {
    defaultParams: ['Hello2, '],
  })

  const withLoadingDelayAction = useRequest(getUsername, {
    defaultParams: ['Hello, '],
    loadingDelay: 3000,
  })

  const trigger = () => {
    action.run(getMathRandom())
    withLoadingDelayAction.run(getMathRandom())
  }

  return (
    <div>
      <button type="button" onClick={trigger}>
        run
      </button>

      <div style={{ margin: '24px 0', width: 300 }}>
        Username: {action.loading ? 'Loading...' : action.data}
      </div>
      <div>
        Username: {withLoadingDelayAction.loading ? 'Loading...' : withLoadingDelayAction.data}
      </div>
    </div>
  )
}
