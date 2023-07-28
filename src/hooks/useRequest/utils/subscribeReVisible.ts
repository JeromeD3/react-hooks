import { isBrowser } from './isBrowser'
import isDocumentVisible from './isDocumentVisible'

const listeners: any[] = []

// 一个发布订阅模式
export default function subscribeReVisible(listener: any) {
  listeners.push(listener)
  return function unsubscribe() {
    const index = listeners.indexOf(listener)
    listeners.splice(index, 1)
  }
}

if (isBrowser) {
  const revalidate = () => {
    if (!isDocumentVisible()) return
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i]
      console.log('listener', listener)
      listener()
    }
  }
  window.addEventListener('visibilitychange', revalidate, false)
}
