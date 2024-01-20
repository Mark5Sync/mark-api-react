/// <reference types="react" />
interface Error {
    message: string;
    code: string;
}
declare const useQuery: <I, T>(url: string, input?: I) => [T, import("react").Dispatch<import("react").SetStateAction<T>>, {
    loading: boolean;
    refetch: () => void;
    error?: Error;
}];
declare const useQuerySync: <I, T>(url: string) => [(input: I) => Promise<T>, {
    loading: boolean;
    error?: Error;
}];
export { useQuery, useQuerySync };
