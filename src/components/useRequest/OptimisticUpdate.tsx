import { useRef, useState } from 'react'
import useRequest from '../../hooks/useRequest/useRequest'

function getUsername(pre: any): Promise<string> {
  console.log('getUsername执行了')

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(pre + 'a')
    }, 1000)
  })
}

let updateSuccess = true
function updateName(newName: any) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (updateSuccess) {
        resolve(newName)
      } else {
        reject(new Error('更新失败'))
      }
    }, 1000)
    updateSuccess = !updateSuccess
  })
}

export default () => {
  const [value, setValue] = useState('')

  // 用于获取数据
  const { data, mutate } = useRequest(getUsername, {
    defaultParams: ['我是沙壁'],
    onBefore: (params: any) => {
      console.log('请求前触发，onBefore', params)
    },
    onError: (error: any, params: any) => {
      console.log('请求失败后触发，onError', error, params)
    },
    onSuccess: (res: any, params: any) => {
      console.log('请求成功后触发，onSuccess', res, params)
    },
    onFinally: (params: any) => {
      console.log('请求结束后触发，onFinally', params)
    },
  })

  // 用于修改数据
  const {
    data: data2,
    run,
    loading,
  } = useRequest(updateName, {
    manual: true, // 手动
    onSuccess: (res: any, params: any) => {
      setValue('')
      console.log('更新成功', res, params)
    },
    onError: (error: any, params: any) => {
      console.log('更新失败，恢复老的值', error, params)
      mutate(lastRef.current) // 更新失败，恢复老的值
    },
  })

  const lastRef = useRef<string>('')
  return (
    <>
      <div>Username: {data}</div>
      <h1>Updata的data:{data2}</h1>
      <input type="text" value={value} onChange={(e) => setValue(e.target.value)} />
      <button
        onClick={() => {
          lastRef.current = data! // 更新前备份老的值
          mutate(value)
          run(value)
        }}
      >
        {loading ? ' 更新中...' : '更新'}
      </button>
    </>
  )
}
