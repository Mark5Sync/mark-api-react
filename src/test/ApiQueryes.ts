

import { useQuery, useQuerySync } from "../hooks/useQuery.ts"
    
    
 /* types */
export type HomeOutput =  (HomeTYPE | null | string)

export interface HomeTYPE {
  message: string;
}

export interface HomeInput {
  name: Name;
}

export type Name =  (null | string)

export interface TodosInput {
  limit: number;
}

export type TodoOutput =  (TodoTYPE | null)

export interface TodoTYPE {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
}

export interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

export interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}

export interface Geo {
  lat: string;
  lng: string;
}

export interface TodoInput {
  id: number;
}
 /* hooks */
export const useTodoQuery = (input: TodoInput) => useQuery<TodoInput,TodoOutput>( 
    'http://localhost:5174/api/todo', input 
)
export const useTodoQuerySync = () => useQuerySync<TodoInput,TodoOutput>( 
    'http://localhost:5174/api/todo'
)
            



export const useTodosQuery = (input: TodosInput) => useQuery<TodosInput,TodoTYPE[]>( 
    'http://localhost:5174/api/todos', input 
)
export const useTodosQuerySync = () => useQuerySync<TodosInput,TodoTYPE[]>( 
    'http://localhost:5174/api/todos'
)
            



export const useHomeQuery = (input: HomeInput) => useQuery<HomeInput,HomeOutput>( 
    'http://localhost:5174/api/home', input 
)
export const useHomeQuerySync = () => useQuerySync<HomeInput,HomeOutput>( 
    'http://localhost:5174/api/home'
)
            
