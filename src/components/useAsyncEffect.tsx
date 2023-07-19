import { useEffect, useState } from 'react'
import useAsyncEffect from '../hooks/Effect/useAsyncEffect'

function mockCheck(): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 3000)
    console.log('执行中')
  })
}

export default () => {
  const [pass, setPass] = useState<boolean>() // TODO: 实现这个hook
  // 增加一个回调
  useAsyncEffect(async (isCanceled: () => boolean) => {
    const isPass = await mockCheck() // 判断是否中断，中断则不再更新状态
    if (!isCanceled()) {
      setPass(isPass)
    }
  }, [])

  // useEffect(() => {
  //   ;(async () => {
  //     const isPass = await mockCheck()
  //     console.log('执行中')
  //     setPass(isPass)
  //   })()
  // }, [])
  return <div>{pass ? '请求完成!' : '请求处理中...'}</div>
}
