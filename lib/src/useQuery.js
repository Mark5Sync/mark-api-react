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
    const refetch = (data) => {
        setLoading(true);
        setError(undefined);
        api(url, data, (result) => {
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
    const refetchMiddleware = () => {
        return !options.middleware
            ? refetch(input)
            : options.middleware(input, data => {
                refetch(data);
            });
    };
    useEffect(refetchMiddleware, options?.deps ? options.deps : []);
    return [[data, setData], { loading, error, refetch: refetchMiddleware, redirect }];
};
const useQuerySync = (url, options) => {
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
    const refetchMiddleware = async (input) => {
        return !options.middleware
            ? await refetch(input)
            : await options.middleware(input, async (data) => {
                return await refetch(data);
            });
    };
    return [refetchMiddleware, { loading, error, redirect }];
};
const useFormAction = (url, options) => {
    const [request, requestProps] = useQuerySync(url);
    const refetch = async (data) => {
        const result = await request(data);
        options.callback && options.callback(result);
    };
    const formAction = async (event) => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(event.target).entries());
        options.middleware
            ? await options.middleware(data, data => refetch(data))
            : await refetch(data);
    };
    return [formAction, requestProps];
};
export { useQuery, useQuerySync, useFormAction, query, };
