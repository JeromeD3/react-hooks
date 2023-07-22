import useLocalStorageState from '../hooks/state/useLocalStorageState'

export default function () {
  const [message, setMessage] = useLocalStorageState<string | undefined>(
    'use-local-storage-state-demo1',
    {
      defaultValue: 'Hello~',
    }
  )

  return (
    <>
      <input
        value={message || ''}
        placeholder="Please enter some words..."
        onChange={(e) => setMessage(e.target.value)}
      />
      <button style={{ margin: '0 8px' }} type="button" onClick={() => setMessage('Hello~')}>
        Reset
      </button>
      <button type="button" onClick={() => setMessage(undefined)}>
        Clear
      </button>

      <WithComplex />
    </>
  )
}

const WithComplex = () => {
  const defaultArray = ['a', 'e', 'i', 'o', 'u']
  const [value, setValue] = useLocalStorageState('use-local-storage-state-demo2', {
    defaultValue: defaultArray,
  })

  return (
    <>
      <p>{value?.join('-')}</p>
      <button
        type="button"
        style={{ marginRight: '16px' }}
        onClick={() => setValue([...value, Math.random().toString(36).slice(-1)])}
      >
        push random
      </button>
      <button type="button" onClick={() => setValue(defaultArray)}>
        reset
      </button>
    </>
  )
}
