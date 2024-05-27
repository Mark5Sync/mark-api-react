import { useEffect, useState } from "react";
const api = async (url, input, extra) => {
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
const useQuery = (url, input, deps) => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const [redirect, setRedirect] = useState(undefined);
    const refetch = () => {
        setLoading(true);
        setError(undefined);
        api(url, input, (result) => {
            setRedirect(result?.redirect);
            setError(result?.error);
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
    useEffect(refetch, deps ? deps : []);
    return [data, setData, { loading, error, refetch, redirect }];
};
const useQuerySync = (url) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [redirect, setRedirect] = useState(undefined);
    const refetch = async (input) => {
        setLoading(true);
        setError(undefined);
        const data = await api(url, input, (result) => {
            setRedirect(result?.redirect);
            setError(result?.error);
        }).catch(error => {
            setError(error);
        });
        setLoading(false);
        if (data)
            return data;
    };
    return [refetch, { loading, error, redirect }];
};
const useFormAction = (url, callback) => {
    const [request, requestProps] = useQuerySync(url);
    const formAction = async (event) => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(event.target).entries());
        const result = await request(data);
        callback && callback(result);
    };
    return [formAction, requestProps];
};
export { useQuery, useQuerySync, useFormAction, };
