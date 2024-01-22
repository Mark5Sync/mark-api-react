import { useEffect, useState } from "react"



interface Error {
    message: string,
    code: string,
}


const api = async <I, T>(url: string, input?: I) => {
    console.log('fetch', url)

    return fetch(url, {
        body: JSON.stringify(input),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
    })
        .then(a => a.json())
        .then(result => {
            if ('data' in result)
                return result.data as T
        })
}



const useQuery = <I, T>(url: string, input?: I): [T | undefined, React.Dispatch<React.SetStateAction<T | undefined>>, { loading: boolean, refetch: () => void, error?: Error }] => {
    const [data, setData] = useState<T | undefined>()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | undefined>()

    const refetch = () => {

        api<I, T>(url, input)
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

    return [data, setData, { loading, error, refetch }]
}



const useQuerySync = <I, T>(url: string): [(input?: I) => Promise<T | undefined>, { loading: boolean, error?: Error }] => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | undefined>()



    const refetch = async (input?: I): Promise<T | undefined> => {
        setLoading(true)

        const result = await api<I, T>(url, input).catch(error => {
            setError(error)
        })

        setLoading(false)
        if (result)
            return result as T
    }

    return [refetch, { loading, error }]
}



export {
    useQuery,
    useQuerySync
}