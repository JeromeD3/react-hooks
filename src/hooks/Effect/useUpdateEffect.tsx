/**
 * 和useEffect基本一致，但是不会处理首次渲染的hook。
 */
import { useRef } from 'react'
import { useEffect } from 'react'
export const useUpdateEffect = (effect: any, deps: any) => {
  const isMounted = useRef(false) 
  // 这个是为了配合webpack插件 react-refresh 的热更新能力, 可以忽略
  
  useEffect(() => {
    isMounted.current = true
  }, []) 
  
  
  // 这里才是核心逻辑
  useEffect(() => {
    
    if (!isMounted.current) {
      isMounted.current = true
    } else {
      // 也要记得处理组件卸载后的回调
      return effect()
    }
  }, deps)
}
