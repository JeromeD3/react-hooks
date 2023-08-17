import { useEffect, useState } from 'react'
import useAsyncEffect from '../hooks/Effect/useAsyncEffect'

function mockCheck(): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 1000)
    console.log('执行中')
  })
}

export default () => {
  const [pass, setPass] = useState<boolean>() // TODO: 实现这个hook
  // 增加一个回调
  useAsyncEffect(async (isCanceled: () => boolean) => {
    console.log('1.发起请求前执行！')

    const isPass = await mockCheck() // 判断是否中断，中断则不再更新状态
    console.log('5. 请求完成后:', isCanceled())
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
