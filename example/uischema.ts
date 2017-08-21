export const attributeView = {
  'type': 'VerticalLayout',
  'elements': [
    {
      'type': 'Group',
      'label': 'Standard',
      'elements': [
        {
          'type': 'Control',
          'scope': {
            '$ref': '#/properties/name'
          }
        },
        {
          'type': 'Control',
          'scope': {
            '$ref': '#/properties/eType'
          }
        },
        {
          'type': 'HorizontalLayout',
          'elements': [
            {
              'type': 'Label',
              'text': 'Bounds'
            },
            {
              'type': 'Control',
              'label': false,
              'scope': {
                '$ref': '#/properties/lowerBound'
              }
            },
            {
              'type': 'Control',
              'label': false,
              'scope': {
                '$ref': '#/properties/upperBound'
              }
            }
          ]
        }
      ]
    },
    {
      'type': 'Group',
      'label': 'Advanced',
      'elements': [
        {
          'type': 'Control',
          'scope': {
            '$ref': '#/properties/unsettable'
          }
        },
        {
          'type': 'Control',
          'scope': {
            '$ref': '#/properties/ordered'
          }
        },
        {
          'type': 'Control',
          'scope': {
            '$ref': '#/properties/unique'
          }
        },
        {
          'type': 'Control',
          'scope': {
            '$ref': '#/properties/changeable'
          }
        },
        {
          'type': 'Control',
          'scope': {
            '$ref': '#/properties/volatile'
          }
        },
        {
          'type': 'Control',
          'scope': {
            '$ref': '#/properties/transient'
          }
        },
        {
          'type': 'Control',
          'scope': {
            '$ref': '#/properties/defaultValueLiteral'
          }
        },
        {
          'type': 'Control',
          'scope': {
            '$ref': '#/properties/derived'
          }
        }
      ]
    }
  ]
};

export const datatype_view =
  {
    'type': 'VerticalLayout',
    'elements': [
      {
        'type': 'Control',
        'scope': {
          '$ref': '#/properties/name'
        }
      },
      {
        'type': 'Control',
        'scope': {
          '$ref': '#/properties/serializable'
        }
      },
      {
        'type': 'Control',
        'scope': {
          '$ref': '#/properties/instanceClassName'
        }
      }
    ]
  };

export const enum_view =
  {
    'type': 'VerticalLayout',
    'elements': [
      {
        'type': 'Control',
        'scope': {
          '$ref': '#/properties/name'
        }
      },
      {
        'type': 'Control',
        'scope': {
          '$ref': '#/properties/eLiterals'
        }
      }
    ]
  };

export const epackage_view =
  {
    'type': 'VerticalLayout',
    'elements': [
      {
        'type': 'Control',
        'scope': {
          '$ref': '#/properties/name'
        }
      },
      {
        'type': 'Control',
        'scope': {
          '$ref': '#/properties/nsURI'
        }
      },
      {
        'type': 'Control',
        'scope': {
          '$ref': '#/properties/nsPrefix'
        }
      }
    ]
  };

export const eReferenceView = {
  'type': 'VerticalLayout',
  'elements': [
    {
      'type': 'Group',
      'label': 'Standard',
      'elements': [
        {
          'type': 'Control',
          'scope': {
            '$ref': '#/properties/name'
          }
        },
        {
          'type': 'Control',
          'scope': {
            '$ref': '#/properties/eType'
          },
          options: {
            id: 'eReference'
          }
        },
        {
          'type': 'HorizontalLayout',
          'elements': [
            {
              'type': 'Control',
              'scope': {
                '$ref': '#/properties/lowerBound'
              }
            },
            {
              'type': 'Control',
              'scope': {
                '$ref': '#/properties/upperBound'
              }
            }
          ]
        },
        {
          'type': 'Control',
          'scope': {
            '$ref': '#/properties/containment'
          }
        }
      ]
    },
    {
      'type': 'Group',
      'label': 'Advanced',
      'elements': [
        {
          'type': 'Control',
          'scope': {
            '$ref': '#/properties/changeable'
          }
        },
        {
          'type': 'Control',
          'scope': {
            '$ref': '#/properties/unsettable'
          }
        },
        {
          'type': 'Control',
          'scope': {
            '$ref': '#/properties/ordered'
          }
        },
        {
          'type': 'Control',
          'scope': {
            '$ref': '#/properties/unique'
          }
        },
        {
          'type': 'Control',
          'scope': {
            '$ref': '#/properties/eOpposite'
          }
        },
        {
          'type': 'Control',
          'scope': {
            '$ref': '#/properties/container'
          }
        },
        {
          'type': 'Control',
          'scope': {
            '$ref': '#/properties/defaultValueLiteral'
          }
        },
        {
          'type': 'Control',
          'scope': {
            '$ref': '#/properties/derived'
          }
        },
        {
          'type': 'Control',
          'scope': {
            '$ref': '#/properties/eKeys'
          }
        },
        {
          'type': 'Control',
          'scope': {
            '$ref': '#/properties/resolveProxies'
          }
        },
        {
          'type': 'Control',
          'scope': {
            '$ref': '#/properties/transient'
          }
        },
        {
          'type': 'Control',
          'scope': {
            '$ref': '#/properties/volatile'
          }
        }
      ]
    }
  ]
};

export const eclass_view = {
  'type': 'VerticalLayout',
  'elements': [
    {
      'type': 'Group',
      'label': 'Standard',
      'elements': [
        {
          'type': 'Control',
          'scope': {
            '$ref': '#/properties/name'
          }
        },
        {
          'type': 'Control',
          'scope': {
            '$ref': '#/properties/abstract'
          }
        },
        {
          'type': 'Control',
          'scope': {
            '$ref': '#/properties/interface'
          }
        }
      ]
    },
    {
      'type': 'Group',
      'label': 'Advanced',
      'elements': [
        {
          'type': 'Control',
          'scope': {
            '$ref': '#/properties/instanceTypeName'
          }
        }
        // ,
        // {
        //     "type": "Control",
        //     "scope": {
        //         "$ref": "#/properties/eSuperTypes"
        //     }
        // }
      ]
    }
  ]
};
