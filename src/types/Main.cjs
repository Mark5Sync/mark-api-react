const JsonToTS = require('json-to-ts')

class Main {
    schema
    url
    dev

    constructor(schema, url, dev) {
        this.schema = schema
        this.url = url
        this.dev = dev
    }


    getTypes(data) {
        return JsonToTS(data, {
            rootName: this.url
        })
    }


    __type__Handler = (interfc) => {
        // console.log({interfc})

        if (interfc && interfc.includes("__TYPE__")) {
            const regex = /interface (\w*).*:(.*)\[\]/s;
            const [_, name, value] = interfc.match(regex);

            return `type ${name} = ${value}`
        }

        return interfc
    }


    capitalizeFirstLetter(text) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }


    matchRootTypes(types) {
        const regex = /^\s*(\w*):\s*(.*);/gm;

        let match;
        const result = {}
        while ((match = regex.exec(types)) !== null) {
            const [_, group1, group2] = match;
            result[group1] = group2
        }

        return result
    }

    matchAllTypes(typeNames, types)
    {
        const result = {};
        const regex = /interface (.*?) (.*$)/gms;

        for (const type of types) {
            const match = regex.exec(type)
            
            if (!match)
                continue
            const [_, _interface, props] = match
            result[_interface] = props   
        }

        return result
    }
}


module.exports = Main