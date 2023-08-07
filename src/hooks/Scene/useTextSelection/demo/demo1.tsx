import useTextSelection from ".."

export default () => {
  const { text } = useTextSelection()
  return (
    <div>
      <p>You can select text all page.</p>
      <p>Result：{text}</p>
    </div>
  )
}
