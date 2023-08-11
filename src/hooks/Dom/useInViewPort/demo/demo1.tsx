import { CSSProperties, useMemo, useRef } from 'react'
import useInViewport from '..'

export default () => {
  return (
    <>
      <A />
      <Threshold />
    </>
  )
}

const A = () => {
  const ref = useRef(null)
  const [inViewport] = useInViewport(ref)

  const inside: CSSProperties = { width: 300, height: 300, overflow: 'scroll', border: '1px solid' }
  const outside: CSSProperties = {
    border: '1px solid',
    height: 100,
    width: 100,
    textAlign: 'center',
    marginTop: 80,
  }
  return (
    <>
      <div>
        <div style={inside}>
          scroll here
          <div style={{ height: 800 }}>
            <div ref={ref} style={outside}>
              observer dom
            </div>
          </div>
        </div>
        <div style={{ marginTop: 16, color: inViewport ? '#87d068' : '#f50' }}>inViewport: {inViewport ? 'visible' : 'hidden'}</div>
      </div>
    </>
  )
}

const Threshold = () => {
  const thresholdArr =[0, 1]
  const [inViewport, ratio] = useInViewport(() => document.getElementById('children'), {
    threshold: thresholdArr, // 这里是引用类型，所以每次都会触发更新
    root: () => document.getElementById('parent'),
  })
  return (
    <div>
      <div style={{ width: 300, height: 300, overflow: 'scroll', border: '1px solid' }} id="parent">
        scroll here
        <div style={{ height: 800 }}>
          <div
            id="children"
            style={{
              border: '1px solid',
              height: 100,
              width: 100,
              textAlign: 'center',
              marginTop: 80,
            }}
          >
            observer dom
          </div>
        </div>
      </div>
      <div style={{ marginTop: 16, color: inViewport ? '#87d068' : '#f50' }}>
        <p>inViewport: {inViewport ? 'visible' : 'hidden'}</p>
        <p>ratio: {ratio}</p>
      </div>
    </div>
  )
}
