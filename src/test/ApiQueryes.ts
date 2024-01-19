
import useQuery from "../hooks/useQuery";
import useQuerySync from "../hooks/useQuerySync";
    
    
 /* types */
interface Httplocalhost5173api {
  TodoInput: TodoInput;
  TodoOutput: TodoOutput;
  CreateTodoInput: CreateTodoInput;
  CreateTodoOutput: TodoOutput;
  TodosOutput: TodoOutput[];
  HomeInput: HomeInput;
  HomeOutput: string;
}

interface HomeInput {
  name: string;
}

interface CreateTodoInput {
  title: string;
}

interface TodoOutput {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
}

interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}

interface Geo {
  lat: string;
  lng: string;
}

interface TodoInput {
  id: string;
}
 /* hooks */
export const useTodoQuery = (input: TodoInput) => useQuery<TodoInput,TodoOutput>( 
    'http://localhost:5173/api/todo', input 
)
export const useTodoQuerySync = () => useQuerySync<TodoInput,TodoOutput>( 
    'http://localhost:5173/api/todo'
)
            



export const useCreateTodoQuery = (input: CreateTodoInput) => useQuery<CreateTodoInput,TodoOutput>( 
    'http://localhost:5173/api/createTodo', input 
)
export const useCreateTodoQuerySync = () => useQuerySync<CreateTodoInput,TodoOutput>( 
    'http://localhost:5173/api/createTodo'
)
            



export const useTodosQuery = () => useQuery<null,TodoOutput[]>( 
    'http://localhost:5173/api/todos',  
)
export const useTodosQuerySync = () => useQuerySync<null,TodoOutput[]>( 
    'http://localhost:5173/api/todos'
)
            



export const useHomeQuery = (input: HomeInput) => useQuery<HomeInput,string>( 
    'http://localhost:5173/api/home', input 
)
export const useHomeQuerySync = () => useQuerySync<HomeInput,string>( 
    'http://localhost:5173/api/home'
)
            
