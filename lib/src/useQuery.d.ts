import { DependencyList, FormEvent } from "react";
export interface Error {
    message: string;
    code: string;
}
type Middleware<T> = (data: T, next: (data: any) => void) => void;
interface QueryOptions<I> {
    deps?: DependencyList;
    middleware?: Middleware<I>;
}
interface QueryFormActionOptions<I, T> {
    middleware?: Middleware<I>;
    callback?: (result: T) => void;
}
declare const query: <I, T>(url: string, input?: I) => Promise<T>;
declare const useQuery: <I, T>(url: string, input?: I, options?: QueryOptions<I>) => [[T | undefined, React.Dispatch<React.SetStateAction<T | undefined>>], {
    loading: boolean;
    refetch: () => void;
    error?: Error;
    redirect?: string;
}];
declare const useQuerySync: <I, T>(url: string) => [(input?: I) => Promise<T | undefined | void>, {
    loading: boolean;
    error?: Error;
    redirect?: string;
}];
declare const useFormAction: <I, T>(url: string, options?: QueryFormActionOptions<I, T>) => [(event: FormEvent) => void, {
    loading: boolean;
    error?: Error;
    redirect?: string;
}];
export { useQuery, useQuerySync, useFormAction, query, QueryOptions, QueryFormActionOptions, };
