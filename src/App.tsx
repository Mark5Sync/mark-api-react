import { useEffect } from 'react'
import './App.css'
import { useTodosQuery } from './test/ApiQueryes'

function App() {
  const [todos, setTodos] = useTodosQuery()

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
    </>
  )
}

export default App
