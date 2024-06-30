// v2
const Main = require("../Main.cjs")


class Builder extends Main {

    allTypes = {}

    getMd(type, title){
        if (type == 'undefined')
            return ''

            const isArray = type.endsWith('[]')
            
            if (isArray)
                type = type.substr(0, type.length - 2)

            if (type in this.allTypes)
                type = this.allTypes[type]
            
            if (isArray)
                type += '[]'
                




        return `
${title}
\`\`\`typescript
${type}
\`\`\`   
`
    }

    getCode() {
        const mapping = process.env.MARK_API_MAPPING ? process.env.MARK_API_MAPPING.split(':') : false
        const docs = []

        const types = {}
        this.schema.map(task => {
            if (task.inputType)
                types[`${task.alias}Input`] = task.inputType

            if (task.outputType)
                types[`${task.alias}Output`] = task.outputType
        })

        const tsTypes = this.getTypes(types)
        const RootTypes = this.matchRootTypes(tsTypes[0])
        this.allTypes = this.matchAllTypes(RootTypes, tsTypes.slice(1))


        let content = this.dev
            ? 'import { useQuery, useQuerySync, useFormAction } from "../hooks/useQuery.ts"'
            : 'import { useQuery, useQuerySync, useFormAction } from "mark-api-react"'


        content += '\n\n\n /* interfaces */\n\n'
        content += tsTypes.slice(1).map(interfc => this.__type__Handler(interfc)).map(interfc => `export ${interfc}`).join('\n\n') + '\n'
        content += '\n\n\n /* hooks */\n'



        const maps = {}
        content += this.schema.map(itm => {
            let file = itm.path
            if (mapping) {
                file = file.replace(mapping[0], mapping[1])
                maps[`use${itm.alias}Query`] = file
                maps[`use${itm.alias}QuerySync`] = file
                maps[`use${itm.alias}FormAction`] = file
            }

            const inputType = itm.inputType ? RootTypes[itm.alias + 'Input'] : 'undefined'
            const outputType = itm.outputType ? RootTypes[itm.alias + 'Output'] : 'undefined'

            const useInputVal = inputType != 'undefined'
            const deps = 'deps?: React.DependencyList'
            const inputVal = useInputVal ? `input: ${inputType}, ${deps}` : deps
            const exceptions = itm.exceptions.reduce((acc, exception) => acc + `> [${exception.code}] ${exception.message}\n`, '')

            docs.push(`
## ${itm.alias} (${itm.shortAlias})
${itm.doc ? `description\n${itm.doc}\n` : ''} 
url
\`\`\`copy
${this.url}/${itm.url}
\`\`\`  
file
\`\`\`file
${file}
\`\`\`  
${this.getMd(inputType, 'input')}
${this.getMd(outputType, 'output')}
${exceptions ? `exceptions\n${exceptions}\n` : ''}
`)

            

            return `
export const use${itm.alias}Query = (${inputVal}) => useQuery<${inputType},${outputType}>( 
    '${this.url}/${itm.url}', ${useInputVal ? 'input' : 'undefined'}, deps
)
export const use${itm.alias}QuerySync = () => useQuerySync<${inputType},${outputType}>( 
    '${this.url}/${itm.url}'
)
export const use${itm.alias}FormAction = (callback?: (data: ${outputType}) => void) => useFormAction<${inputType},${outputType}>( 
    '${this.url}/${itm.url}', callback
)`

        }).join('')

        return {
            data: content,
            mapp: mapping ? maps : undefined,
            docs,
        }
    }

}


module.exports = Builder