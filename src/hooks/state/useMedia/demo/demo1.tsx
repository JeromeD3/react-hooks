import useMedia from ".."

const Demo = () => {
  // useMedia(query: string, defaultState: boolean = false): boolean;
  const isWide = useMedia('(min-width: 480px)')

  return <div>Screen is wide: {isWide ? 'Yes' : 'No'}</div>
}
export default Demo
