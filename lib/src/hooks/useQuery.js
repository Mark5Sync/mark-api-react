import { useEffect, useState } from "react";
const api = async (url, input, extra) => {
    // console.log('fetch', url)
    return fetch(url, {
        body: JSON.stringify(input),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
    })
        .then(a => a.json())
        .then(result => {
        if (extra)
            extra(result);
        if ('data' in result)
            return result.data;
    });
};
const useQuery = (url, input) => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const [redirect, setRedirect] = useState(undefined);
    const refetch = () => {
        api(url, input, (result) => {
            if (result?.redirect)
                setRedirect(result.redirect);
            if (result?.error)
                setError(result.error);
        })
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
    return [data, setData, { loading, error, refetch, redirect }];
};
const useQuerySync = (url) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [redirect, setRedirect] = useState(undefined);
    const refetch = async (input) => {
        setLoading(true);
        const data = await api(url, input, (result) => {
            if (result?.redirect)
                setRedirect(result.redirect);
            if (result?.error)
                setError(result.error);
        }).catch(error => {
            setError(error);
        });
        setLoading(false);
        if (data)
            return data;
    };
    return [refetch, { loading, error, redirect }];
};
export { useQuery, useQuerySync };
