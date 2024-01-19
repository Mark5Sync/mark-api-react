import { useEffect } from 'react'
import { useCreateTodoQuerySync, useTodosQuery } from './test/ApiQueryes'

function App() {
  const [todos, setTodos] = useTodosQuery()
  const [createToto, createProps] = useCreateTodoQuerySync()


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
    const created = await createToto({ title: '111' })
    console.log({ created })
  }


  return (
    <>
      {

        todos && todos.map(todo => {
          return <div key={todo.id}>
            {todo.website}
          </div>
        })

      }

      <button onClick={onRemoveFirts}>remove</button>
      <button onClick={onCreate}>{createProps.loading ? 'load': 'create'}</button>

    </>
  )
}

export default App
