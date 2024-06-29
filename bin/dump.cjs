#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const BuilderV1 = require('../src/types/v1/BuilderV1.cjs')
const Builder = require('../src/types/v2/Builder.cjs')


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


    if ('error' in response) {
        console.error(response.error)
        return false
    }



    const { version, schema } = response

    const useUrl = useFullUrl ? url : shortUrl

    switch (version) {
        case 2:
            return (new Builder(schema, useUrl, dev)).getCode()

        case 1:
        default:
            return (new BuilderV1(response, useUrl, dev)).getCode()
    }

}





try {
    const url = process.env.MARK_API_URL
    const file = process.env.MARK_API_FILE
    const dev = process.env.MARK_API_DEV
    const useFullUrl = process.env.MARK_API_USE_FULL_URL
    const TOKEN = process.env.MARK_API_TOKEN
    const MARK_API_DOC = process.env.MARK_API_DOC
    const MARK_API_DOCS = process.env.MARK_API_DOCS





    console.log({ url, dev })

    loadDic(url, TOKEN, dev, useFullUrl).then(({data, mapp, docs}) => {
        if (!data)
            return 'exit'

        const directoryPath = path.dirname(file);
        fs.mkdirSync(directoryPath, { recursive: true });

        fs.writeFileSync(file, data, 'utf8');

        console.log('create file', file)


        if (mapp)
            fs.writeFileSync('./mapp.json', JSON.stringify(mapp, null, 2))

        if (MARK_API_DOC && docs)
            fs.writeFileSync(MARK_API_DOC, docs.join('\n\n\n'))


    })

} catch (error) {
    console.error('Error reading or parsing the JSON file:', error);
}