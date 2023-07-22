import useCookieState from '../hooks/state/useCookieState'

export default () => {
  const [message, setMessage] = useCookieState('useCookieStateString')
  return (
    <>
      <input
        value={message}
        placeholder="Please enter some words..."
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: 300 }}
      />
      <WithFn />
      <WithOption />
    </>
  )
}

const WithFn = () => {
  const [value, setValue] = useCookieState('useCookieStateUpdater', {
    defaultValue: '0',
  })

  return (
    <>
      <p>{value}</p>
      <button
        type="button"
        style={{ marginRight: '16px' }}
        onClick={() => setValue((v: any) => String(Number(v) + 1))}
      >
        inc +
      </button>
      <button
        type="button"
        style={{ marginRight: '16px' }}
        onClick={() => setValue((v: any) => String(Number(v) - 1))}
      >
        dec -
      </button>
      <button type="button" onClick={() => setValue('0')}>
        reset
      </button>
    </>
  )
}

const WithOption = () => {
  const [value, setValue] = useCookieState('useCookieStateOptions', {
    defaultValue: '0',
    path: '/',
    expires: (() => new Date(+new Date() + 10000))(),
  })

  return (
    <>
      <p>{value}</p>
      <button
        type="button"
        style={{ marginRight: 16 }}
        onClick={() =>
          setValue((v: any) => String(Number(v) + 1), {
            expires: (() => new Date(+new Date() + 10000))(),
          })
        }
      >
        inc + (10s expires)
      </button>
      <button
        type="button"
        style={{ marginRight: 16 }}
        onClick={() =>
          setValue((v: any) => String(Number(v) - 1), {
            expires: (() => new Date(+new Date() + 10000))(),
          })
        }
      >
        dec - (10s expires)
      </button>
      <button type="button" onClick={() => setValue('0')}>
        reset
      </button>
    </>
  )
}
