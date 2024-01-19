
import useQuery from "../hooks/useQuery";
    
    
    
 /* types */
interface Httplocalhost5173api {
  TodoInput: TodoInput;
  TodoOutput: TodoOutput;
  TodosOutput: TodoOutput[];
  HomeInput: HomeInput;
  HomeOutput: string;
}

interface HomeInput {
  name: string;
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
            



export const useTodosQuery = () => useQuery<null,TodoOutput[]>( 
    'http://localhost:5173/api/todos',  
)
            



export const useHomeQuery = (input: HomeInput) => useQuery<HomeInput,string>( 
    'http://localhost:5173/api/home', input 
)
            
