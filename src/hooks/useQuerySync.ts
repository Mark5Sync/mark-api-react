import { useState } from "react"

const useQuerySync = <I, T>(url: string): [(input: I) => Promise<T | null>, { loading: boolean }] => {
    const [loading, setLoading] = useState(false)


    const refetch = async (input: I): Promise<T | null> => {
        setLoading(true)

        try {
            const result = await fetch(url, {
                body: JSON.stringify(input)
            }).then(a => a.json())

            if ('data' in result)
                return result.data
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }

        return null
    }

    return [refetch, { loading }]
}

export default useQuerySync