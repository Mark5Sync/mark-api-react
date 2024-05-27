import { DependencyList, FormEvent } from "react";
export interface Error {
    message: string;
    code: string;
}
declare const useQuery: <I, T>(url: string, input?: I, deps?: DependencyList) => [T | undefined, React.Dispatch<React.SetStateAction<T | undefined>>, {
    loading: boolean;
    refetch: () => void;
    error?: Error;
    redirect?: string;
}];
declare const useQuerySync: <I, T>(url: string) => [(input?: I) => Promise<T | undefined>, {
    loading: boolean;
    error?: Error;
    redirect?: string;
}];
declare const useFormAction: <I, T>(url: string, callback?: (data: T) => void) => [(event: FormEvent) => void, {
    loading: boolean;
    error?: Error;
    redirect?: string;
}];
export { useQuery, useQuerySync, useFormAction, };
