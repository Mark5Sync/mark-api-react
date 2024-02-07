import { useEffect, useState } from "react"


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
    })
        .then(a => a.json())
        .then(result => {
            if (extra) extra(result)
            if ('data' in result)
                return result.data as T
        })
}



const useQuery = <I, T>(url: string, input?: I): [T | undefined, React.Dispatch<React.SetStateAction<T | undefined>>, { loading: boolean, refetch: () => void, error?: Error, redirect?: string }] => {
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

    useEffect(refetch, [])


    return [data, setData, { loading, error, refetch, redirect }]
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



export {
    useQuery,
    useQuerySync
}