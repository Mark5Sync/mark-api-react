import { useEffect, useState } from "react"


const useQuery = <I, T>(url: string, input?: I): [T | null, React.Dispatch<React.SetStateAction<T | null>>, { loading: boolean, error?: Error }] => {
    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {


        fetch(url, {
            body: JSON.stringify(input)
        }).then(a => a.json()).then(result => {
            if ('data' in result)
                setData(result.data)
        })
        .finally(() => {
            setLoading(false)
        })
        .catch((e) => {
            console.error(e)
        })


    }, [])



    return [data, setData, { loading }]
}


export default useQuery