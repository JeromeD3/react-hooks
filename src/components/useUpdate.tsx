import useUpdate from "../hooks/Effect/useUpdate"

export default () => {
  const update = useUpdate()

  return (
    <>
      <div>Time: {Date.now()}</div>
      <button type="button" onClick={update} style={{ marginTop: 8 }}>
        update
      </button>
    </>
  )
}
