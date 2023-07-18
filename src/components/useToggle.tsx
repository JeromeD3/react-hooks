import useToggle from '../hooks/state/useToggle'

const UseToggle = () => {
  const [state, { toggle, set, setLeft, setRight }] = useToggle('Hello', 'World')
  return (
    <>
      <h1>Effects:{state}</h1>
      <button onClick={toggle}>Toggle</button>
      <button onClick={() => set('A')}>Set Hello</button>
      <button onClick={() => set('B')}>Set World</button>
      <button onClick={setLeft}>Set Left</button>
      <button onClick={setRight}>Set Right</button>
    </>
  )
}
export default UseToggle
