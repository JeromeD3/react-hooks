const listeners: any = {}

const trigger = (key: any, data: any) => {
  console.log("listeners", listeners)
  if (listeners[key]) {
    listeners[key].forEach((item: any) => item(data))
  }
}

const subscribe = (key: any, listener: any) => {
  if (!listeners[key]) {
    listeners[key] = []
  }
  
  listeners[key].push(listener)
  return function unsubscribe() {
    const index = listeners[key].indexOf(listener)
    listeners[key].splice(index, 1)
  }
}
export { trigger, subscribe }
