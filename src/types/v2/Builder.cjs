// v2
const Main = require("../Main.cjs")


class Builder extends Main {

    allTypes = {}

    getMd(type, title) {
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
            ? 'import { useQuery, useQuerySync, useFormAction, query, QueryOptions, QueryFormActionOptions } from "../hooks/useQuery.ts"'
            : 'import { useQuery, useQuerySync, useFormAction, query, QueryOptions, QueryFormActionOptions } from "mark-api-react"'


        content += '\n\n\n /* interfaces */\n\n'
        this.undefinedTypes = {}
        content += tsTypes.slice(1).map(interfc => this.__type__Handler(interfc)).map(interfc => this.__type__ReplaceUndefined(interfc)).join('\n\n') + '\n'
        content += '\n\n\n /* hooks */\n'



        const maps = {}
        content += this.schema.map(itm => {
            let file = itm.path
            if (mapping) {
                file = file.replace(mapping[0], mapping[1])

                maps[`get${itm.alias}`] = file
                maps[`use${itm.alias}`] = file
                maps[`use${itm.alias}Sync`] = file
                maps[`use${itm.alias}FormAction`] = file
            }

            const inputType = itm.inputType ? RootTypes[itm.alias + 'Input'] : 'undefined'
            const outputType = itm.outputType ? RootTypes[itm.alias + 'Output'] : 'undefined'

            const useInputVal = inputType != 'undefined'
            const inputVal = useInputVal ? `input: ${inputType}` : ''
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
export const get${itm.alias} = (${inputVal}) => query<${inputType},${outputType}>( 
    '${this.fullUrl}/${itm.url}', ${useInputVal ? 'input' : 'undefined'}
)
export const use${itm.alias} = (${useInputVal ? `${inputVal},` : ''} options?: QueryOptions<${inputType}>) => useQuery<${inputType},${outputType}>( 
    '${this.url}/${itm.url}', ${useInputVal ? 'input' : 'undefined'}, options
)
export const use${itm.alias}Sync = () => useQuerySync<${inputType},${outputType}>( 
    '${this.url}/${itm.url}'
)
export const use${itm.alias}FormAction = (options?: QueryFormActionOptions<${inputType},${outputType}>) => useFormAction<${inputType},${outputType}>( 
    '${this.url}/${itm.url}', options
)`

        }).join('')

        return {
            data: content,
            mapp: mapping ? maps : undefined,
            mappFile: mapping[2] ?? 'mapp.json',
            docs,
        }
    }

}


module.exports = Builder