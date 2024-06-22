// v2
const Main = require("../Main.cjs")


class Builder extends Main {

    getCode() {
        const mapping = process.env.MARK_API_MAPPING


        const types = {}
        this.schema.map(task => {
            if (task.inputType)
                types[`${task.alias}Input`] = task.inputType

            if (task.outputType)
                types[`${task.alias}Output`] = task.outputType
        })

        const tsTypes = this.getTypes(types)
        const RootTypes = this.matchRootTypes(tsTypes[0])


        let content = this.dev
            ? 'import { useQuery, useQuerySync, useFormAction } from "../hooks/useQuery.ts"'
            : 'import { useQuery, useQuerySync, useFormAction } from "mark-api-react"'


        content += '\n\n\n /* interfaces */\n\n'
        content += tsTypes.slice(1).map(interfc => this.__type__Handler(interfc)).map(interfc => `export ${interfc}`).join('\n\n') + '\n'
        content += '\n\n\n /* hooks */\n'




        content += this.schema.map(itm => {

            const inputType = itm.inputType ? RootTypes[itm.alias + 'Input'] : 'undefined'
            const outputType = itm.outputType ? RootTypes[itm.alias + 'Output'] : 'undefined'

            const useInputVal = inputType != 'undefined'
            const deps = 'deps?: React.DependencyList'
            const inputVal = useInputVal ? `input: ${inputType}, ${deps}` : deps

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
            mapp: mapping ? { hello: 'world', mapping } : undefined
        }
    }

}


module.exports = Builder