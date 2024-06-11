#!/usr/bin/env node

import BuilderV1 from '../src/types/v1/BuilderV1.cjs';
import Builder from '../src/types/v2/Builder.cjs';

const fs = require('fs');
const path = require('path');

require('dotenv').config()


const domain_from_url = (url) => {
    let result
    let match
    if (match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)(:?\d+)?/im)) {
        result = match[0]
    }
    return result
}

const loadDic = async (url, token, dev, useFullUrl) => {
    const serverUrl = `${url}/__doc__`
    const domain = domain_from_url(url)
    const shortUrl = url.replace(domain, '')
    const response = await fetch(serverUrl, {
        method: 'POST',
        body: JSON.stringify({
            token,
        })
    }).then(a => a.json())


    if (!('schema' in response)) {
        if ('error' in response)
            console.error(response.error)

        return false
    }

    const { version, schema } = response

    const useUrl = useFullUrl ? url : shortUrl

    switch (version) {
        case 1:
            return (new BuilderV1(response, useUrl, dev)).getCode()

        case 2:
            return (new Builder(schema, useUrl, dev)).getCode()

        default:
            console.error(`Неизвестная версия: ${version}`)
    }

}





try {
    const url = process.env.MARK_API_URL
    const file = process.env.MARK_API_FILE
    const dev = process.env.MARK_API_DEV
    const useFullUrl = process.env.MARK_API_USE_FULL_URL
    const TOKEN = process.env.MARK_API_TOKEN



    console.log({ url, dev })

    loadDic(url, TOKEN, dev, useFullUrl).then(data => {
        if (!data)
            return 'exit'

        const directoryPath = path.dirname(file);
        fs.mkdirSync(directoryPath, { recursive: true });

        fs.writeFileSync(file, data, 'utf8');

        console.log('create file', file)
    })

} catch (error) {
    console.error('Error reading or parsing the JSON file:', error);
}