export const schema = {
    definitions: {
        a: {
            type: "object",
            properties: {
                name: {type: 'string'},
                recursion: {
                  type: 'array',
                  items: {'$ref': '#/definitions/a'}
                }
            }
        }
    },
    type: "object",
    properties: {
        name: {
            type: 'string'
        },
        a: {
          type: 'array',
          items: {
            $ref: '#/definitions/a'
          }
        }
    }
}

export const data = {
    name: 'RecursiveData',
    a: [{
        name: '1.1',
        recursion : [
          {name: '2.1', recursion: []},
          {name: '2.2', recursion: []}
        ]
    }]
}
