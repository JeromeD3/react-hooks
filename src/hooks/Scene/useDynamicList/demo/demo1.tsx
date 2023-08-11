import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { Input } from 'antd'
import useDynamicList from '..'

export default () => {
  const { list, remove, getKey, resetList, insert, replace } = useDynamicList(['David', 'Jack'])

  const Row = (index: number, item: any) => (
    <div key={getKey(index)} style={{ marginBottom: 16 }}>
      <Input style={{ width: 300 }} placeholder="Please enter name" onChange={(e) => replace(index, e.target.value)} value={item} />

      {list.length > 1 && (
        <MinusCircleOutlined
          style={{ marginLeft: 8 }}
          onClick={() => {
            remove(index)
          }}
        />
      )}
      <PlusCircleOutlined
        style={{ marginLeft: 8 }}
        onClick={() => {
          insert(index + 1, '')
        }}
      />
    </div>
  )
        const newList = [...list, 'new']
  return (
    <>
      {list.map((ele, index) => Row(index, ele))}
      <div>{JSON.stringify([list])}</div>
      <button onClick={() => resetList(newList)}>reset</button>
    </>
  )
}
