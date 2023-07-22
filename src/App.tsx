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
import UseMemoizedFn from './components/useMemoizedFn'

function App() {
  const [state, setState] = useState(true)
  return (
    <>
      <button onClick={() => setState(!state)}> 切换状态（模拟组件卸载）</button>
      {state && <UseMemoizedFn />}
    </>
  )
}

export default App
