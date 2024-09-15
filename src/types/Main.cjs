const JsonToTS = require('json-to-ts')

class Main {
    schema
    url
    dev


    useFullUrl
    shortUrl
    fullUrl


    constructor(schema, uri, dev) {
        this.schema = schema
        this.url = uri.useFullUrl ? uri.url : uri.shortUrl


        this.useFullUrl = uri.useFullUrl
        this.shortUrl = uri.shortUrl
        this.fullUrl = uri.url



        this.dev = dev
    }


    getTypes(data) {
        return JsonToTS(data, {
            rootName: this.url
        })
    }

    undefinedTypes = {}
    __type__Handler = (interfc) => {
        // console.log({interfc})

        if (interfc && interfc.includes("__TYPE__")) {
            const regex = /interface (\w*).*:(.*)\[\]/s;
            const [_, name, value] = interfc.match(regex);

            try {
                const [__, type] = value.match(/ \((\w*) | undefined\)/);

                if (type) {
                    this.undefinedTypes[name] = type;
                    return false
                }
            } catch (error) {

            }


            return `type ${name} = ${value}`
        }

        return interfc
    }

    
    __type__ReplaceUndefined = (interfc) => {
        if (!interfc)
            return '';

        const replaced = interfc.replace(/(: (\w*))/gm, (match, offset, type, test) => {

            if (type in this.undefinedTypes)
                return `?: ${this.undefinedTypes[type]}`

            return match
        })

        return `export ${replaced}`;
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

    matchAllTypes(typeNames, types) {
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