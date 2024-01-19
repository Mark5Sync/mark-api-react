import { useEffect } from 'react'
import { useTodoQuerySync, useTodosQuery } from './test/ApiQueryes'

function App() {
  const [todos, setTodos] = useTodosQuery({ limit: '1' })
  const [createToto, createProps] = useTodoQuerySync()


  useEffect(() => {
    console.log({ todos })
  }, [todos])



  const onRemoveFirts = () => {
    setTodos(todos => {
      if (!todos)
        return []

      const result = [...todos]
      return result.filter((_, index) => !!index)
    })
  }


  const onCreate = async () => {
    const created = await createToto({ id: (todos ? todos.length + 1 : 1) + '' })
    if (created)
      setTodos(prev => prev ? [...prev, created] : [created])
  }


  return (
    <span style={{ textAlign: 'center' }}>
      {

        todos && todos.map(todo => {
          return <div key={todo.id}>
            {todo.email}
          </div>
        })

      }

      <button onClick={onRemoveFirts}>remove</button>
      <button onClick={onCreate}>{createProps.loading ? 'load' : 'create'}</button>
    </span>
  )
}

export default App
