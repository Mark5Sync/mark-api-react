import { DependencyList } from "react";
export interface Error {
    message: string;
    code: string;
}
declare const useQuery: <I, T>(url: string, input?: I, deps?: DependencyList) => [T, import("react").Dispatch<import("react").SetStateAction<T>>, {
    loading: boolean;
    refetch: () => void;
    error?: Error;
    redirect?: string;
}];
declare const useQuerySync: <I, T>(url: string) => [(input?: I) => Promise<T>, {
    loading: boolean;
    error?: Error;
    redirect?: string;
}];
export { useQuery, useQuerySync };
