import { useEffect, useState } from "react";
const api = async (url, input) => {
    console.log('fetch', url);
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
            return result.data;
    });
};
const useQuery = (url, input) => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const refetch = () => {
        api(url, input)
            .then(result => {
            setData(result);
        })
            .catch(e => {
            setError({
                message: e.message,
                code: e.code,
            });
        })
            .finally(() => {
            setLoading(false);
        });
    };
    useEffect(refetch, []);
    return [data, setData, { loading, error, refetch }];
};
const useQuerySync = (url) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const refetch = async (input) => {
        setLoading(true);
        const result = await api(url, input).catch(error => {
            setError(error);
        });
        setLoading(false);
        if (result)
            return result;
    };
    return [refetch, { loading, error }];
};
export { useQuery, useQuerySync };
