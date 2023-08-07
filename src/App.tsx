import { useState } from 'react'
import './App.css'
// import UseLatest from './components/useLatest'
// import UseUnmount from './components/useUnmount'
// import UseDebounceFn from './components/useDebounceFn'
// import UseLockFn from './components/useLockFn'
// import UsePrevious from './components/usePrevious'
// import UseToggle from './components/useToggle'
// import UseUpdateEffect from './components/useUpdateEffect'
// import UseAsyncEffect from './components/useAsyncEffect'
// import UseMemoizedFn from './components/useMemoizedFn'
// import UseBoolean from './components/useBoolean'
// import UseSetState from './components/useSetState'
// import UseMap from './components/useMap'
// import UseLocalStorageState from './components/useLocalStorageState'
// import UseCookieState from './components/useCookieState'
// import UseUpdate from './components/useUpdate'
// import UseCreation from './components/useCreation'
// import UseMount from './components/useMount'
// import UseRequest from './components/useRequest/OptimisticUpdate'
// import UseRequest from './components/useRequest/cancel'
// import UseRequest from './components/useRequest/LoadingDelay'
// import UseRequest from './components/useRequest/pollingInterval'
// import UseRequest from './components/useRequest/Ready'
// import UseRequest from './components/useRequest/refreshDeps'
// import UseRequest from './components/useRequest/RefreshOnWindowFocus'
// import UseRequest from './components/useRequest/retryCount'
// import UseRequest from './components/useRequest/SWR'
// import UseRequest from './components/useRequest/debounce'
// import UseRequest from './components/useRequest/throttleWait'

// import UseEventListener from './hooks/Dom/useEventListener/demo/demo1'
// import UseEventListener from './hooks/Dom/useEventListener/demo/demo2'
// import UseRafState from './hooks/state/useRafState/demo/demo1'
// import UseSize from './hooks/Dom/useSize/demo/demo1'
// import UseVirtualList from './hooks/Scene/useVirtualList/demo/demo1'
// import UseVirtualList from './hooks/Scene/useVirtualList/demo/demo2'
import UseHistoryTravel from './hooks/Scene/useHistoryTravel/demo/demo2'

function App() {
  const [state, setState] = useState(true)
  return (
    <>
      <button onClick={() => setState(!state)}> 切换状态（模拟组件卸载）</button>
      {state && <UseHistoryTravel />}
    </>
  )
}

export default App
