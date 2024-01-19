const fs = require('fs');
const path = require('path');
const JsonToTS = require('json-to-ts')

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

const loadDic = async (url) => {
    const serverUrl = `${url}/__doc__`
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
import useQuery from "../hooks/useQuery";
    
    
    ` + '\n'

    content += ' /* types */' + '\n'
    content += tsTypes.join('\n\n') + '\n'
    content += ' /* hooks */'
    content += Object.keys(data.methods).map(methodName => {
        const Method = capitalizeFirstLetter(methodName)

        const inputType  = 'input' in data.methods[methodName]   ? RootTypes[Method + 'Input'] : 'null'
        const outputType = 'output' in data.methods[methodName] ? RootTypes[Method + 'Output'] : 'null'

        const useInputVal = inputType != 'null'
        const inputVal = useInputVal ? `input: ${inputType}` : ''

        return `
export const use${Method}Query = (${inputVal}) => useQuery<${inputType},${outputType}>( 
    '${url}/${methodName}', ${useInputVal ? 'input' : ''} 
)
            
`


    }).join('\n\n')

    return content
}






const filePath = path.resolve('./mark-api.json');
try {
    const config = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    loadDic(config.url).then(data => {
        if (!data)
            return 'exit'

        const directoryPath = path.dirname(config.out);
        fs.mkdirSync(directoryPath, { recursive: true });

        fs.writeFileSync(config.out, data, 'utf8');

        console.log('create file', config.out)
    })

} catch (error) {
    console.error('Error reading or parsing the JSON file:', error);
}