export const schema = {
    definitions: {
        a: {
            type: "object",
            properties: {
                recursion: {$ref: "#/definitions/a"}
            }
        }
    },
    type: "object",
    properties: {
        name: {
            type: 'string'
        },
        a: {
            $ref: '#/definitions/a'
        }
    }
}

export const data = {
    name: 'RecursiveData',
    a: {
        recursion : {}
    }
}
