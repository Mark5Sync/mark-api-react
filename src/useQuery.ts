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


const useQuery = <I, T>(url: string, input?: I, deps?: DependencyList): [[T | undefined, React.Dispatch<React.SetStateAction<T | undefined>>], { loading: boolean, refetch: () => void, error?: Error, redirect?: string }] => {
    const [data, setData] = useState<T | undefined>()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | undefined>()
    const [redirect, setRedirect] = useState<string | undefined>(undefined)


    const refetch = () => {
        setLoading(true)
        setError(undefined)

        api<I, T>(url, input, (result: ApiResult<T>) => {
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

    useEffect(refetch, deps ? deps : [])


    return [[data, setData], { loading, error, refetch, redirect }]
}



const useQuerySync = <I, T>(url: string): [(input?: I) => Promise<T | undefined>, { loading: boolean, error?: Error, redirect?: string }] => {
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



const useFormAction = <I, T>(url: string, callback?: (data: T) => void): [(event: FormEvent) => void, { loading: boolean, error?: Error, redirect?: string }] => {
    const [request, requestProps] = useQuerySync(url)

    const formAction = async (event: FormEvent) => {
        event.preventDefault();

        const data = Object.fromEntries(
            (new FormData(event.target as HTMLFormElement) as any).entries()
        ) as I;

        const result = await request(data) as T
        callback && callback(result)
    }

    return [formAction, requestProps]
}


export {
    useQuery,
    useQuerySync,
    useFormAction,
    query,
}