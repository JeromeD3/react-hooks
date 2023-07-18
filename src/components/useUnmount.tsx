import { useState } from 'react'
import useUnmount from '../hooks/LifeCycle/useUnmount'
// 被点击的组件
const ClickArea = () => {
  // 点击次数
  const [cnt, setCnt] = useState(0)
  const callback = () => {
    // 哎哟我的天神啊，为什么一直是0啊
    console.log('点击次数:', cnt)
  }
  // useEffect(() => {
  //   // 这里的callback是一个闭包，它引用了ClickArea组件的cnt状态
  //   // 所以这里也会有一个引用问题
  //   return callback
  // }, [])
  useUnmount(() => {
    callback()
  })

  return (
    <div
      style={{ background: 'red', width: '200px', height: '200px' }}
      onClick={() => setCnt(cnt + 1)}
    >
      {cnt}
    </div>
  )
}
const App = () => {
  // 模拟卸载组件（真实场景下可能是因为路由切换而卸载）
  const [isShow, setIsShow] = useState(true)
  return (
    <div>
      {isShow && <ClickArea></ClickArea>}
      <button onClick={() => setIsShow(!isShow)}>是否 卸载 组件？</button>   
    </div>
  )
}
export default App
