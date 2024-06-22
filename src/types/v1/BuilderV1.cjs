// v1

const Main = require("../Main.cjs")

class BuilderV1 extends Main {

    getCode() {
        const tsTypes = this.getTypes(this.schema.data.types)
        const RootTypes = this.matchRootTypes(tsTypes[0])


        let content = this.dev
            ? 'import { useQuery, useQuerySync, useFormAction } from "../hooks/useQuery.ts"'
            : 'import { useQuery, useQuerySync, useFormAction } from "mark-api-react"'



        content += ' /* types */' + '\n'
        content += tsTypes.slice(1).map(interfc => this.__type__Handler(interfc)).map(interfc => `export ${interfc}`).join('\n\n') + '\n'
        content += ' /* hooks */'
        content += Object.keys(this.schema.data.methods).map(methodName => {
            const Method = this.capitalizeFirstLetter(methodName)

            const inputType = 'input' in this.schema.data.methods[methodName] ? RootTypes[Method + 'Input'] : 'undefined'
            const outputType = 'output' in this.schema.data.methods[methodName] ? RootTypes[Method + 'Output'] : 'undefined'

            const useInputVal = inputType != 'undefined'
            const deps = 'deps?: React.DependencyList'
            const inputVal = useInputVal ? `input: ${inputType}, ${deps}` : deps

            return `
export const use${Method}Query = (${inputVal}) => useQuery<${inputType},${outputType}>( 
    '${this.url}/${methodName}', ${useInputVal ? 'input' : 'undefined'}, deps
)
export const use${Method}QuerySync = () => useQuerySync<${inputType},${outputType}>( 
    '${this.url}/${methodName}'
)
export const use${Method}FormAction = (callback?: (data: ${outputType}) => void) => useFormAction<${inputType},${outputType}>( 
    '${this.url}/${methodName}', callback
)`


        }).join('')

        return { data: content }
    }

}


module.exports = BuilderV1