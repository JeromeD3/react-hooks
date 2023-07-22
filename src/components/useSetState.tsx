import useSetState from '../hooks/state/useSetState'

export default () => {
  const [state, setState] = useSetState({
    hello: '',
  })

  return (
    <div>
      <Test2 />
      <pre>{JSON.stringify(state, null, 2)}</pre>
      <p>
        <button type="button" onClick={() => setState({ hello: 'world' })}>
          set hello
        </button>
        <button type="button" onClick={() => setState({ foo: 'bar' })} style={{ margin: '0 8px' }}>
          set foo
        </button>
      </p>
    </div>
  )
}

const Test2 = () => {
  const [state, setState] = useSetState({
    hello: 'world',
    count: 0,
  })

  return (
    <div>
      <pre>{JSON.stringify(state, null, 2)}</pre>
      <p>
        <button type="button" onClick={() => setState((prev: any) => ({ count: prev.count + 1 }))}>
          count + 1
        </button>
      </p>
    </div>
  )
}
