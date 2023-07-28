import isDocumentVisible from './isDocumentVisible'
const listeners: any = []

function subscribe(listener: any) {
  listeners.push(listener)
  return function unsubscribe() {
    const index = listeners.indexOf(listener)
    listeners.splice(index, 1)
  }
}

const revalidate = () => {
  if (!isDocumentVisible()) return
  for (let i = 0; i < listeners.length; i++) {
    const listener = listeners[i]
    listener()
  }
}

window.addEventListener('visibilitychange', revalidate, false)
window.addEventListener('focus', revalidate, false) // 主要用于聚焦浏览器的时候重新请求数据

export default subscribe
