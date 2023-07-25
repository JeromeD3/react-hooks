/**
 * 保证被 memo 的值一定不会被重计算
 * 只有初始化和依赖变化时才会重新计算
 */

import { useRef } from "react"
// 通过 Object.is 比较依赖数组的值是否相等
function depsAreSame(oldDeps: any, deps: any): boolean {
  if (oldDeps === deps) return true
  for (let i = 0; i < oldDeps.length; i++) {
    if (!Object.is(oldDeps[i], deps[i])) return false
  }
  return true
}

function useCreation<T>(factory: () => T, deps: any) {
  console.log("执行了");
  
  const { current } = useRef({
    deps,
    obj: undefined as undefined | T,
    initialized: false,
  })
  // 初始化或依赖变更时，重新初始化
  if (current.initialized === false || !depsAreSame(current.deps, deps)) {
    current.deps = deps // 更新依赖
    current.obj = factory() // 执行创建所需对象的函数
    current.initialized = true // 初始化标识为 true
  }
  return current.obj as T
}

export default useCreation
