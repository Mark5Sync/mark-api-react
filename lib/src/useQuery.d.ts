import { DependencyList, FormEvent } from "react";
export interface Error {
    message: string;
    code: string;
}
type Middleware<I, O> = (data: I, request: (data: any, onResult?: (data: O) => void) => void, response: (data: O) => void) => void;
interface QueryOptions<I, O> {
    deps?: DependencyList;
    middleware?: Middleware<I, O>;
}
interface QueryFormActionOptions<I, O> {
    middleware?: Middleware<I, O>;
    callback?: (result: O) => void;
}
declare const query: <I, T>(url: string, input?: I) => Promise<T>;
declare const useQuery: <I, O>(url: string, input?: I, options?: QueryOptions<I, O>) => [[O | undefined, React.Dispatch<React.SetStateAction<O | undefined>>], {
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
declare const useFormAction: <I, O>(url: string, options?: QueryFormActionOptions<I, O>) => [(event: FormEvent) => void, {
    loading: boolean;
    error?: Error;
    redirect?: string;
}];
export { useQuery, useQuerySync, useFormAction, query, QueryOptions, QueryFormActionOptions, };
