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

type Middleware<I, O> = (data: I, request: (data: any, onResult?: (data: O) => void) => void, response: (data: O) => void) => void

interface QueryOptions<I, O> {
    deps?: DependencyList,
    middleware?: Middleware<I, O>,
}


interface QueryFormActionOptions<I, O> {
    middleware?: Middleware<I, O>,
    callback?: (result: O) => void,
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


const useQuery = <I, O>(url: string, input?: I, options?: QueryOptions<I, O>): [[O | undefined, React.Dispatch<React.SetStateAction<O | undefined>>], { loading: boolean, refetch: () => void, error?: Error, redirect?: string }] => {
    const [data, setData] = useState<O | undefined>()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | undefined>()
    const [redirect, setRedirect] = useState<string | undefined>(undefined)


    const refetch = (data: any, apply: (data: O) => void) => {
        setLoading(true)
        setError(undefined)

        api<I, O>(url, data, (result: ApiResult<O>) => {
            setRedirect(result?.redirect)
            setError(result?.error)
        })
            .then((result) => {
                apply(result)
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
        if (!options?.middleware) {
            refetch(input, setData)
            return
        }

        options.middleware(input, (data, onResult) => refetch(data, onResult ? onResult : setData), setData)
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


const useFormAction = <I, O>(url: string, options?: QueryFormActionOptions<I, O>): [(event: FormEvent) => void, { loading: boolean, error?: Error, redirect?: string }] => {
    const [request, requestProps] = useQuerySync(url)


    const refetch = async (data: any) => {
        const result = await request(data) as O

        if (options?.callback)
            options.callback(result)
    }


    const formAction = async (event: FormEvent) => {
        event.preventDefault();

        const data = Object.fromEntries(
            (new FormData(event.target as HTMLFormElement) as any).entries()
        ) as I;

        options?.middleware
            ? options.middleware(data, data => refetch(data), (data: O) => { options.callback && options.callback(data) })
            : refetch(data)
    }

    return [formAction, requestProps]
}


export {
    useQuery,
    useQuerySync,
    useFormAction,
    query,


    QueryOptions,
    QueryFormActionOptions,
}