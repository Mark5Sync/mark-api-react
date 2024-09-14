import { DependencyList, FormEvent, useEffect, useState } from "react"


export interface Error {
    message: string,
    code: string,
}


interface ApiResult<T> {
    data: T,
    error?: Error,
    redirect?: string,
}

type Middleware<T> =  (data: T, next: (props: any) => void) => void

interface QueryOptions<I> {
    deps?: DependencyList,
    middleware?: Middleware<I>,
}


interface QueryFormActionOptions<I, T> {
    middleware?: Middleware<I>,
    callback?: (result: T) => void,
}


const api = async <I, T>(url: string, input?: I, extra?: (data: ApiResult<T>) => void) => {
    return fetch(url, {
        body: JSON.stringify(input),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        cache: 'no-store',
    })
        .then(a => a.json())
        .then(result => {
            if (extra) extra(result)
            if ('data' in result)
                return result.data as T
        })
}


const query = async <I, T>(url: string, input?: I) => {
    const result = await fetch(url, {
        body: JSON.stringify(input),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
    }).then(result => result.json()) as { data: T }

    return result.data
}


const useQuery = <I, T>(url: string, input?: I, options?: QueryOptions<I> ): [[T | undefined, React.Dispatch<React.SetStateAction<T | undefined>>], { loading: boolean, refetch: () => void, error?: Error, redirect?: string }] => {
    const [data, setData] = useState<T | undefined>()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | undefined>()
    const [redirect, setRedirect] = useState<string | undefined>(undefined)


    const refetch = (data: any) => {
        setLoading(true)
        setError(undefined)

        api<I, T>(url, data, (result: ApiResult<T>) => {
            setRedirect(result?.redirect)
            setError(result?.error)

        })
            .then(result => {
                setData(result)
            })
            .catch(e => {
                setError({
                    message: e.message,
                    code: e.code,
                })
            })
            .finally(() => {
                setLoading(false)
            })
    }


    const refetchMiddleware = () => {

        return !options.middleware
            ?refetch(input)
            :options.middleware(
                input, 
                data => {
                    refetch(data)
                }
            )

    }

    useEffect(refetchMiddleware, options?.deps ? options.deps : [])


    return [[data, setData], { loading, error, refetch: refetchMiddleware, redirect }]
}



const useQuerySync = <I, T>(url: string): [(input?: I) => Promise<T | undefined | void>, { loading: boolean, error?: Error, redirect?: string }] => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | undefined>()
    const [redirect, setRedirect] = useState<string | undefined>(undefined)


    const refetch = async (input?: I): Promise<T | undefined> => {
        setLoading(true)
        setError(undefined)

        const data = await api<I, T>(url, input, (result: ApiResult<T>) => {
            setRedirect(result?.redirect)
            setError(result?.error)

        }).catch(error => {
            setError(error)
        })

        setLoading(false)
        if (data)
            return data
    }

    return [refetch, { loading, error, redirect }]
}


const useFormAction = <I, T>(url: string, options: QueryFormActionOptions<I, T>): [(event: FormEvent) => void, { loading: boolean, error?: Error, redirect?: string }] => {
    const [request, requestProps] = useQuerySync(url)

    
    const refetch = async (data: any) => {
        const result = await request(data) as T

        if (options.callback)
            options.callback(result)
    }


    const formAction = async (event: FormEvent) => {
        event.preventDefault();

        const data = Object.fromEntries(
            (new FormData(event.target as HTMLFormElement) as any).entries()
        ) as I;

        options.middleware
            ?options.middleware(data, data => refetch(data))
            :refetch(data)
    }

    return [formAction, requestProps]
}


export {
    useQuery,
    useQuerySync,
    useFormAction,
    query,
}