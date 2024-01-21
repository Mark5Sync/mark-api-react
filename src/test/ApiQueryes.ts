

import { useQuery, useQuerySync } from "mark-api-react";
    
    
 /* types */
type HomeOutput =  (string[] | HomeTYPE2 | string)

interface HomeTYPE2 {
  message: string;
}

interface HomeInput {
  name: string;
}

interface TodosInput {
  limit: string;
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
    'http://localhost:8800/api/todo', input 
)
export const useTodoQuerySync = () => useQuerySync<TodoInput,TodoOutput>( 
    'http://localhost:8800/api/todo'
)
            



export const useTodosQuery = (input: TodosInput) => useQuery<TodosInput,TodoOutput[]>( 
    'http://localhost:8800/api/todos', input 
)
export const useTodosQuerySync = () => useQuerySync<TodosInput,TodoOutput[]>( 
    'http://localhost:8800/api/todos'
)
            



export const useHomeQuery = (input: HomeInput) => useQuery<HomeInput,HomeOutput>( 
    'http://localhost:8800/api/home', input 
)
export const useHomeQuerySync = () => useQuerySync<HomeInput,HomeOutput>( 
    'http://localhost:8800/api/home'
)
            
