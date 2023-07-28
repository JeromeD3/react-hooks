const limit = (fn: any, timespan: any) => {
  let pending = false
  return (...args: any) => {
    if (pending) return
    pending = true
    fn(...args)
    setTimeout(() => {
      pending = false
    }, timespan)
  }
}

export default limit
