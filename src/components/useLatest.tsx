import { useState, useEffect } from 'react'
import { useLatest } from '../hooks/Advanced/useLatest'
export default () => {
  const [cnt, setCount] = useState(0)
  const cntRef = useLatest(cnt)
  useEffect(() => {
    const id = setInterval(() => {
      setCount(cntRef.current + 1)
    }, 400) // 记得要及时销毁定时器
    return () => clearInterval(id)
  }, [])
  return (
    <>
      <p>总是最新的捏: {cnt}</p>
    </>
  )
}

// https://juejin.cn/post/7246643397426036796?searchId=20230718185956A6A80E21C53CD2BBE794
