export const ecore_schema =
{
  definitions: {
    annotation: {
      id:'#annotation',
      'type': 'object',
      'properties': {
        'eClass': {
          'type': 'string'
        },
        '_id': {
          'type': 'string'
        },
        'source': {
          'type': 'string'
        },
        'details': {
          'type': 'object'
        }
      },
      'additionalProperties': false
    },
    enum: {
      id:'#enum',
      'type': 'object',
      'properties': {
        'eClass': {
          'type': 'string',
          default: 'http://www.eclipse.org/emf/2002/Ecore#//EEnum'
        },
        '_id': {
          'type': 'string'
        },
        'name': {
          'type': 'string'
        },
        'instanceClassName': {
          'type': 'string'
        },
        'instanceTypeName': {
          'type': 'string'
        },
        'serializable': {
          'type': 'boolean'
        },
        'eLiterals': {
          'type': 'array',
          'items': {
            'type': 'string'
          }
        },
        'eAnnotations': {
          'type': 'array',
          'items': {
            $ref: '#/definitions/annotation'
          }
        }
      },
      'additionalProperties': false
    },
    datatype: {
      id:'#datatype',
      'type': 'object',
      'properties': {
        'eClass': {
          'type': 'string',
          default: 'http://www.eclipse.org/emf/2002/Ecore#//EDataType'
        },
        '_id': {
          'type': 'string'
        },
        'name': {
          'type': 'string'
        },
        'instanceClassName': {
          'type': 'string'
        },
        'instanceTypeName': {
          'type': 'string'
        },
        'serializable': {
          'type': 'boolean'
        },
        'eAnnotations': {
          'type': 'array',
          'items': {
            $ref: '#/definitions/annotation'
          }
        }
      },
      'additionalProperties': false
    },
    eclass: {
      'type': 'object',
      id:'#class',
      'properties': {
        'eClass': {
          'type': 'string',
          default: 'http://www.eclipse.org/emf/2002/Ecore#//EClass'
        },
        '_id': {
          'type': 'string'
        },
        'name': {
          'type': 'string'
        },
        'instanceClassName': {
          'type': 'string'
        },
        'instanceTypeName': {
          'type': 'string'
        },
        'abstract': {
          'type': 'boolean'
        },
        'interface': {
          'type': 'boolean'
        },
        'eStructuralFeatures': {
          'type': 'array',
          'items': {
            // $ref: '#/definitions/attribute'
            anyOf: [
              {$ref: '#/definitions/attribute'},
              {$ref: '#/definitions/reference'}
            ]
          }
        },
        'eOperations': {
          'type': 'array',
          'items': {
            id:'#operation',
            'type': 'object',
            'properties': {
              'eClass': {
                'type': 'string'
              },
              '_id': {
                'type': 'string'
              },
              'name': {
                'type': 'string'
              },
              'ordered': {
                'type': 'boolean'
              },
              'unique': {
                'type': 'boolean'
              },
              'lowerBound': {
                'type': 'integer'
              },
              'upperBound': {
                'type': 'integer'
              },
              'many': {
                'type': 'boolean'
              },
              'required': {
                'type': 'boolean'
              },
              'eType': {
                'type': 'object',
                'properties': {
                  'eClass': {
                    'type': 'string'
                  },
                  '$ref': {
                    'type': 'string'
                  }
                },
                'additionalProperties': false
              },
              'eTypeParameters': {
                'type': 'array',
                'items': {
                  'id': '#typeparameter',
                  'type': 'object',
                  'properties': {
                    'eClass': {
                      'type': 'string'
                    },
                    '_id': {
                      'type': 'string'
                    },
                    'name': {
                      'type': 'string'
                    }
                  },
                  'additionalProperties': false
                }
              },
              'eParameters': {
                'type': 'array',
                'items': {
                  'id': '#parameter',
                  'type': 'object',
                  'properties': {
                    'eClass': {
                      'type': 'string'
                    },
                    '_id': {
                      'type': 'string'
                    },
                    'name': {
                      'type': 'string'
                    },
                    'ordered': {
                      'type': 'boolean'
                    },
                    'unique': {
                      'type': 'boolean'
                    },
                    'lowerBound': {
                      'type': 'integer'
                    },
                    'upperBound': {
                      'type': 'integer'
                    },
                    'many': {
                      'type': 'boolean'
                    },
                    'required': {
                      'type': 'boolean'
                    },
                    'eType': {
                      'type': 'object',
                      'properties': {
                        'eClass': {
                          'type': 'string'
                        },
                        '$ref': {
                          'type': 'string'
                        }
                      },
                      'additionalProperties': false
                    },
                    'eGenericType': {
                      'type': 'object',
                      'properties': {
                        'eClass': {
                          'type': 'string'
                        },
                        '_id': {
                          'type': 'string'
                        },
                        'eClassifier': {
                          'type': 'object',
                          'properties': {
                            'eClass': {
                              'type': 'string'
                            },
                            '$ref': {
                              'type': 'string'
                            }
                          },
                          'additionalProperties': false
                        },
                        'eTypeArguments': {
                          'type': 'array',
                          'items': {
                            'type': 'object',
                            'properties': {
                              'eClass': {
                                'type': 'string'
                              },
                              '_id': {
                                'type': 'string'
                              }
                            },
                            'additionalProperties': false
                          }
                        }
                      },
                      'additionalProperties': false
                    }
                  },
                  'additionalProperties': false
                }
              }
            },
            'additionalProperties': false
          }
        },
        'eAnnotations': {
          'type': 'array',
          'items': {
            $ref: '#/definitions/annotation'
          }
        }
      },
      'additionalProperties': false
    },
    attribute: {
      id:'#attribute',
      'type': 'object',
      'properties': {
        'eClass': {
          'type': 'string',
          default: 'http://www.eclipse.org/emf/2002/Ecore#//EAttribute'
        },
        '_id': {
          'type': 'string'
        },
        'name': {
          'type': 'string'
        },
        'ordered': {
          'type': 'boolean'
        },
        'unique': {
          'type': 'boolean'
        },
        'lowerBound': {
          'type': 'integer'
        },
        'upperBound': {
          'type': 'integer'
        },
        'many': {
          'type': 'boolean'
        },
        'required': {
          'type': 'boolean'
        },
        'changeable': {
          'type': 'boolean'
        },
        'volatile': {
          'type': 'boolean'
        },
        'transient': {
          'type': 'boolean'
        },
        'defaultValueLiteral': {
          'type': 'string'
        },
        'unsettable': {
          'type': 'boolean'
        },
        'derived': {
          'type': 'boolean'
        },
        'containment': {
          'type': 'boolean'
        },
        'resolveProxies': {
          'type': 'boolean'
        },
        'eType': {
          'type': 'object',
          'properties': {
            'eClass': {
              'type': 'string'
            },
            '$ref': {
              'type': 'string'
            }
          },
          'additionalProperties': false
        }
      },
      'additionalProperties': false
    },
    reference: {
      'id': '#reference',
      'type': 'object',
      'properties': {
        'eClass': {
          'type': 'string',
          default: 'http://www.eclipse.org/emf/2002/Ecore#//EReference'
        },
        '_id': {
          'type': 'string'
        },
        'name': {
          'type': 'string'
        },
        'ordered': {
          'type': 'boolean'
        },
        'unique': {
          'type': 'boolean'
        },
        'lowerBound': {
          'type': 'integer'
        },
        'upperBound': {
          'type': 'integer'
        },
        'many': {
          'type': 'boolean'
        },
        'required': {
          'type': 'boolean'
        },
        'changeable': {
          'type': 'boolean'
        },
        'volatile': {
          'type': 'boolean'
        },
        'transient': {
          'type': 'boolean'
        },
        'defaultValueLiteral': {
          'type': 'string'
        },
        'unsettable': {
          'type': 'boolean'
        },
        'derived': {
          'type': 'boolean'
        },
        'containment': {
          'type': 'boolean'
        },
        'resolveProxies': {
          'type': 'boolean'
        },
        'eType': {
          'type': 'object',
          'properties': {
            'eClass': {
              'type': 'string'
            },
            '$ref': {
              'type': 'string'
            }
          },
          'additionalProperties': false
        },
        'eOpposite': {
          'type': 'object',
          'properties': {
            '$ref': {
              'type': 'string'
            }
          },
          'additionalProperties': false
        }
      },
      'additionalProperties': false
    }
  },
  'type': 'object',
  id:'#package',
  'properties': {
    'eClass': {
      'type': 'string',
      default: 'http://www.eclipse.org/emf/2002/Ecore#//EPackage'
    },
    '_id': {
      'type': 'string'
    },
    'name': {
      'type': 'string'
    },
    'nsURI': {
      'type': 'string'
    },
    'nsPrefix': {
      'type': 'string'
    },
    'eClassifiers': {
      'type': 'array',
      'items': {
        // $ref: '#/definitions/eclass'
        anyOf: [
            {$ref: '#/definitions/eclass'},
            {$ref: '#/definitions/enum'},
            {$ref: '#/definitions/datatype'}
        ]
      }
    }
  },
  'additionalProperties': false
};
