const fs = require('fs');
const path = require('path');
const JsonToTS = require('json-to-ts')
require('dotenv').config()

const capitalizeFirstLetter = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

const matchRootTypes = (types) => {
    const regex = /^\s*(\w*):\s*(.*);/gm;

    let match;
    const result = {}
    while ((match = regex.exec(types)) !== null) {
        const [_, group1, group2] = match;
        result[group1] = group2
    }

    return result
}

const __type__Handler = (interfc) => {
    // console.log({interfc})

    if (interfc && interfc.includes("__TYPE__")) {
        const regex = /interface (\w*).*:(.*)\[\]/s;
        const [_, name, value] = interfc.match(regex);

        return `type ${name} = ${value}`
    }

    return interfc
}

const loadDic = async (url, dev) => {
    const serverUrl = `${url}/__doc__`
    const shortUrl = url.substring(url.search('/'))
    const serverDoc = await fetch(serverUrl).then(a => a.json())


    if (!('data' in serverDoc)) {
        if ('error' in serverDoc)
            console.error(serverDoc.error)

        return false
    }

    const data = serverDoc.data
    const tsTypes = JsonToTS(data.types, {
        rootName: url
    })


    const RootTypes = matchRootTypes(tsTypes[0])
    // console.log({ RootTypes })

    let content = `

${
    dev
        ?'import { useQuery, useQuerySync } from "../hooks/useQuery.ts"'
        :'import { useQuery, useQuerySync } from "mark-api-react"'
}
    
    ` + '\n'

    content += ' /* types */' + '\n'
    content += tsTypes.slice(1).map(interfc => __type__Handler(interfc)).map(interfc => `export ${interfc}`).join('\n\n') + '\n'
    content += ' /* hooks */'
    content += Object.keys(data.methods).map(methodName => {
        const Method = capitalizeFirstLetter(methodName)

        const inputType = 'input' in data.methods[methodName] ? RootTypes[Method + 'Input'] : 'undefined'
        const outputType = 'output' in data.methods[methodName] ? RootTypes[Method + 'Output'] : 'undefined'

        const useInputVal = inputType != 'undefined'
        const inputVal = useInputVal ? `input: ${inputType}` : ''

        return `
export const use${Method}Query = (${inputVal}) => useQuery<${inputType},${outputType}>( 
    '/${shortUrl}/${methodName}', ${useInputVal ? 'input' : ''} 
)
export const use${Method}QuerySync = () => useQuerySync<${inputType},${outputType}>( 
    '/${shortUrl}/${methodName}'
)
            
`


    }).join('\n\n')

    return content
}






// const filePath = path.resolve('./mark-api.json');
try {
    // const config = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const url  = process.env.MARK_API_URL
    const file = process.env.MARK_API_FILE
    const dev  = process.env.MARK_API_DEV

    console.log({url, dev})

    loadDic(url, dev).then(data => {
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