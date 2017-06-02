export const schema = {
  'definitions': {
    'Floor': {
      'type': 'array',
      'items': {
        'type': 'object',
        'properties': {
          'name': {
            'type': 'string'
          },
          'description': {
            'type': 'string'
          }
        }
      }
    }
  },
  'type': 'object',
  'properties': {
    'name': {
      'type': 'string'
    },
    'Floors': {
      $ref: '#/definitions/Floor'
    }
  }
};

export const data = {
  'name': 'root_element',
  'Floors': [
    {
      'name': 'floor1',
      'description': 'this is floor 1'
    },
    {
      'name': 'floor2',
      'description': 'this is floor 2'
    }
  ]
};
