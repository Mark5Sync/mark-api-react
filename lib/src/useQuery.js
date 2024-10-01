import { useEffect, useState } from "react";
const api = async (url, input, extra) => {
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
        if (extra)
            extra(result);
        if ('data' in result)
            return result.data;
    });
};
const query = async (url, input) => {
    const result = await fetch(url, {
        body: JSON.stringify(input),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
    }).then(result => result.json());
    return result.data;
};
const useQuery = (url, input, options) => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const [redirect, setRedirect] = useState(undefined);
    const refetch = (data, apply) => {
        setLoading(true);
        setError(undefined);
        api(url, data, (result) => {
            setRedirect(result?.redirect);
            setError(result?.error);
        })
            .then((result) => {
            apply(result);
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
    const refetchMiddleware = () => {
        if (!options?.middleware) {
            refetch(input, setData);
            return;
        }
        options.middleware(input, (data, response) => refetch(data, response ? response : setData), setData);
    };
    useEffect(refetchMiddleware, options?.deps ? options.deps : []);
    return [[data, setData], { loading, error, refetch: refetchMiddleware, redirect }];
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
const useFormAction = (url, options) => {
    const [request, requestProps] = useQuerySync(url);
    const refetch = async (data) => {
        const result = await request(data);
        if (options?.callback)
            options.callback(result);
    };
    const formAction = async (event) => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(event.target).entries());
        options?.middleware
            ? options.middleware(data, data => refetch(data), (data) => { options.callback && options.callback(data); })
            : refetch(data);
    };
    return [formAction, requestProps];
};
export { useQuery, useQuerySync, useFormAction, query, };
