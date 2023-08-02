import { useRef } from 'react'
import useSize from '..'

export default () => {
  const ref = useRef(null)
  const size = useSize(ref)
  return (
    <>
      <div ref={ref}>
        <p>Try to resize the preview window </p>
        <p>
          width: {size?.width}px, height: {size?.height}px
        </p>
      </div>
    
    </>
  )
}
