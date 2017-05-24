import test from 'ava';

import { JsonSchema } from 'jsonforms/dist/ts-build/models/jsonSchema';
import { SchemaExtractor } from './schema_extractor';
import { ItemModel, isItemModel, isMultipleItemModel, MULTIPLICITY_TYPES } from './item_model';

test('support root array with object', t => {
    const schema = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {type: 'string'}
        }
      }
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      t.deepEqual(result,
        {
          label: 'root',
          schema:
          {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: {type: 'string'}
              }
            }
          },
          dropPoints: {
            'array':
              {
                label: 'array',
                schema:
                {
                  type: 'object',
                  properties: {
                    name: {type: 'string'}
                  }
                },
                dropPoints: {}
              }
          }
        });
    });
});
test('support root array with array', t => {
    const schema = {
      type: 'array',
      items: {
        type: 'array',
        items: {
          type: 'object'
        }
      }
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      const itemModel = <ItemModel>result;
      t.deepEqual(itemModel, {label: 'root', schema:
        {
          type: 'array',
          items: {
            type: 'array',
            items: {
              type: 'object'
            }
          }
        },
        // fullschema: {
        //   type: 'array',
        //   items: {
        //     type: 'array',
        //     items: {
        //       type: 'object'
        //     }
        //   }
        // },
        dropPoints: {'array': {label: 'array', schema:
          {
            type: 'array',
            items: {
              type: 'object'
            }
          },
          dropPoints: {'array': {label: 'array', schema:
            {type: 'object'}, dropPoints: {}
            // , fullschema: {
            //   type: 'array',
            //   items: {
            //     type: 'array',
            //     items: {
            //       type: 'object'
            //     }
            //   }
            // }
          }}
            // ,
            // fullschema: {
            //   type: 'array',
            //   items: {
            //     type: 'array',
            //     items: {
            //       type: 'object'
            //     }
            //   }
            // },
        }}
      });
    });
});
test('no support for tuple array ', t => {
    const schema_stringarray = {
      type: 'array',
      items: [
        {type: 'string'}, {type: 'boolean'}
      ]
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema_stringarray);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      t.deepEqual(result,
        {
          label: 'root',
          schema:
          {
            type: 'array',
            items: [
              {type: 'string'}, {type: 'boolean'}
            ]
          },
          dropPoints: {
          }
        });
    });
});
test('no support for simple string array ', t => {
    const schema_stringarray = {
      type: 'array',
      items: {
        type: 'string'
      }
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema_stringarray);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      t.deepEqual(result,
        {
          label: 'root',
          schema:
          {
            type: 'array',
            items: {
              type: 'string'
            }
          },
          dropPoints: {
          }
        });
    });
});
test('no support for simple number array ', t => {
    const schema_numberarray = {
      type: 'array',
      items: {
        type: 'number'
      }
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema_numberarray);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      t.deepEqual(result,
        {
          label: 'root',
          schema:
          {
            type: 'array',
            items: {
              type: 'number'
            }
          },
          dropPoints: {
          }
        });
    });
});
test('no support for simple integer array ', t => {
    const schema_integerarray = {
      type: 'array',
      items: {
        type: 'integer'
      }
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema_integerarray);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      t.deepEqual(result,
        {
          label: 'root',
          schema:
          {
            type: 'array',
            items: {
              type: 'integer'
            }
          },
          dropPoints: {
          }
        });
    });
});
test('no support for simple boolean array ', t => {
    const schema_booleanarray = {
      type: 'array',
      items: {
        type: 'boolean'
      }
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema_booleanarray);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      t.deepEqual(result,
        {
          label: 'root',
          schema:
          {
            type: 'array',
            items: {
              type: 'boolean'
            }
          },
          dropPoints: {
          }
        });
    });
});
test('root object simple properties are ignored', t => {
    const schema = {
      type: 'object',
      properties: {
        string: {type: 'string'},
        number: {type: 'number'},
        integer: {type: 'integer'},
        boolean: {type: 'boolean'}
      }
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      t.deepEqual(result,
        {
          label: 'root',
          schema: {
            type: 'object',
            properties: {
              string: {type: 'string'},
              number: {type: 'number'},
              integer: {type: 'integer'},
              boolean: {type: 'boolean'}
            }
          },
          dropPoints: {}
        });
    });
});
test('root object object properties is dropPoint', t => {
    const schema = {
      type: 'object',
      properties: {
        object: {type: 'object'}
      }
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      t.deepEqual(result,
        {
          label: 'root',
          schema: {
            type: 'object',
            properties: {
              object: {type: 'object'}
            }
          },
          dropPoints: {
            object: {label: 'object', schema: {type: 'object'}, dropPoints: {}}
          }
        });
    });
});
test('support root object with array of object', t => {
    const schema = {
      type: 'object',
      properties: {
        myarray: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {type: 'string'}
            }
          }
        }
      }
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      t.deepEqual(result,
        {
          label: 'root',
          schema:
          {
            type: 'object',
            properties: {
              myarray: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: {type: 'string'}
                  }
                }
              }
            }
          },
          dropPoints: {
            'myarray':
              {
                label: 'myarray',
                schema:
                {
                  type: 'object',
                  properties: {
                    name: {type: 'string'}
                  }
                },
                dropPoints: {}
              }
            }
        });
    });
});
test('support root object with object of objects', t => {
    const schema = {
      type: 'object',
      properties: {
        myObject: {
          type: 'object',
          additionalProperties: {
            type: 'object',
            properties: {
              name: {type: 'string'}
            }
          }
        }
      }
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      t.deepEqual(result,
        {
          label: 'root',
          schema:
          {
            type: 'object',
            properties: {
              myObject: {
                type: 'object',
                additionalProperties: {
                  type: 'object',
                  properties: {
                    name: {type: 'string'}
                  }
                }
              }
            }
          },
          dropPoints: {
            'myObject':
              {
                label: 'myObject',
                schema:
                {
                  type: 'object',
                  properties: {
                    name: {type: 'string'}
                  }
                },
                dropPoints: {}
              }
            }
        });
    });
});
test('support object with additionalProperties', t => {
    const schema = {
      type: 'object',
      additionalProperties: {
        type: 'object',
        properties: {
          name: {type: 'string'}
        }
      }
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      t.deepEqual(result, {label: 'root', schema: {
        type: 'object',
        additionalProperties: {
          type: 'object',
          properties: {
            name: {type: 'string'}
          }
        }
      },
        dropPoints: {
          'object': {
            label: 'object',
            schema: {
              type: 'object',
              properties: {
                name: {type: 'string'}
              }
            },
            dropPoints: {}
          }
        }
      });
    });
});
test('no support for simple string additionalProperties ', t => {
    const schema_stringarray = {
      type: 'object',
      additionalProperties: {
        type: 'string'
      }
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema_stringarray);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      t.deepEqual(result,
        {
          label: 'root',
          schema:
          {
            type: 'object',
            additionalProperties: {
              type: 'string'
            }
          },
          dropPoints: {
          }
        });
    });
});
test('no support for simple number additionalProperties ', t => {
    const schema_stringarray = {
      type: 'object',
      additionalProperties: {
        type: 'number'
      }
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema_stringarray);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      t.deepEqual(result,
        {
          label: 'root',
          schema:
          {
            type: 'object',
            additionalProperties: {
              type: 'number'
            }
          },
          dropPoints: {
          }
        });
    });
});
test('no support for simple integer additionalProperties ', t => {
    const schema_stringarray = {
      type: 'object',
      additionalProperties: {
        type: 'integer'
      }
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema_stringarray);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      t.deepEqual(result,
        {
          label: 'root',
          schema:
          {
            type: 'object',
            additionalProperties: {
              type: 'integer'
            }
          },
          dropPoints: {
          }
        });
    });
});
test('no support for simple boolean additionalProperties ', t => {
    const schema_stringarray = {
      type: 'object',
      additionalProperties: {
        type: 'boolean'
      }
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema_stringarray);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      t.deepEqual(result,
        {
          label: 'root',
          schema:
          {
            type: 'object',
            additionalProperties: {
              type: 'boolean'
            }
          },
          dropPoints: {
          }
        });
    });
});
test('support root $ref', t => {
    const schema = {
      definitions: {
        root: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {type: 'string'}
            }
          }
        }
      },
      $ref: '#/definitions/root'
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      t.deepEqual(result, {label: 'root', schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: {type: 'string'}
          }
        }
      },
        dropPoints: {
          'array': {
            label: 'array',
            schema: {
              type: 'object',
              properties: {
                name: {type: 'string'}
              }
            },
            dropPoints: {}
          }
        }
      });
    });
});
test('support object with array $ref', t => {
    const schema = {
      definitions: {
        root: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {type: 'string'}
            }
          }
        }
      },
      'type': 'object',
      'properties': {
        'roots': {
          '$ref': '#/definitions/root'
        }
      }
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      t.deepEqual(result, {label: 'root',
        schema:
        {
          definitions: {
            root: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: {type: 'string'}
                }
              }
            }
          },
          'type': 'object',
          'properties': {
            'roots': {
              '$ref': '#/definitions/root'
            }
          }
        },
        dropPoints: {
          roots: {
            label: 'root',
            schema: {
              type: 'object',
              properties: {
                name: {type: 'string'}
              }
            },
            dropPoints: {}
          }
        }
      });
    });
});
test.only('self-contained child schemata: no recursion', t => {
  const schema = {
    definitions: {
      person: {
        type: 'object',
        properties: {
          robots: {
            type: 'array',
            items: {$ref: '#/definitions/robot'}
          }
        }
      },
      robot: {
        type: 'object',
        properties: {
          name: {type: 'string'}
        }
      }
    },
    type: 'object',
    properties: {
      persons: {type: 'array', items: {$ref: '#/definitions/person'}}
    }
  } as JsonSchema;
  const extractor = new SchemaExtractor(schema);
  return extractor.extract().then(result => {
    t.true(isItemModel(result));
    t.deepEqual(result, {label: 'root',
      schema:
      {
        definitions: {
          person: {
            type: 'object',
            properties: {
              robots: {
                type: 'array',
                items: {$ref: '#/definitions/robot'}
              }
            }
          },
          robot: {
            type: 'object',
            properties: {
              name: {type: 'string'}
            }
          }
        },
        type: 'object',
        properties: {
          persons: {type: 'array', items: {$ref: '#/definitions/person'}}
        }
      },
      dropPoints: {
        persons: {
          label: 'person',
          schema: {
            definitions: {
              robot: {
                type: 'object',
                properties: {
                  name: {type: 'string'}
                }
              }
            },
            type: 'object',
            properties: {
              robots: {
                type: 'array',
                items: {$ref: '#/definitions/robot'}
              }
            }
          },
          dropPoints: {
            robots: {
              label: 'robot',
              schema: {
                type: 'object',
                properties: {
                  name: {type: 'string'}
                }
              },
              dropPoints: {}
            }
          }
        }
      }
    });
  });
});
// test.only('resolve ref with ref to self-contained child schemata: ', t => {
//   const schema = {
//     definitions: {
//       person: {
//         type: 'object',
//         properties: {
//           robots: {
//             type: 'array',
//             items: {$ref: '#/definitions/robot'}
//           }
//         }
//       },
//       robot: {
//         type: 'object',
//         properties: {
//           owners: {
//             type: 'array',
//             items: {$ref: '#/definitions/person'}
//           }
//         }
//       }
//     },
//     type: 'object',
//     properties: {
//       persons: {type: 'array', items: {$ref: '#/definitions/person'}}
//     }
//   } as JsonSchema;
//   const extractor = new SchemaExtractor(schema);
//   return extractor.extract().then(result => {
//     t.true(isItemModel(result));
//     t.deepEqual(result, {label: 'root',
//       schema:
//       {
//         definitions: {
//           person: {
//             type: 'object',
//             properties: {
//               robots: {
//                 type: 'array',
//                 items: {$ref: '#/definitions/robot'}
//               }
//             }
//           },
//           robot: {
//             type: 'object',
//             properties: {
//               owners: {
//                 type: 'array',
//                 items: {$ref: '#/definitions/person'}
//               }
//             }
//           }
//         },
//         type: 'object',
//         properties: {
//           persons: {type: 'array', items: {$ref: '#/definitions/person'}}
//         }
//       },
//       dropPoints: {
//         persons: {
//           label: 'person',
//           schema: {
//             definitions: {
//               robot: {
//                 type: 'object',
//                 properties: {
//                   owners: {
//                     type: 'array',
//                     items: {$ref: '#/definitions/person'}
//                   }
//                 }
//               }
//             },
//             type: 'object',
//             properties: {
//               robots: {
//                 type: 'array',
//                 items: {$ref: '#/definitions/robot'}
//               }
//             }
//           },
//           dropPoints: {
//             robots: {
//               label: 'person',
//               schema: {
//                 definitions: {
//                   person: {
//                     type: 'object',
//                     properties: {
//                       robots: {
//                         type: 'array',
//                         items: {$ref: '#/definitions/robot'}
//                       }
//                     }
//                   }
//                 },
//                 type: 'object',
//                 properties: {
//                   owners: {
//                     type: 'array',
//                     items: {$ref: '#/definitions/person'}
//                   }
//                 }
//               }
//             }
//           }
//         }
//       }
//     });
//   });
// });
test('support multiple same $ref', t => {
    const schema = {
      definitions: {
        person: {
          type: 'object',
          properties: {
            name: {type: 'string'}
          }
        }
      },
      type: 'object',
      properties: {
        friends: {type: 'array', items: {$ref: '#/definitions/person'}},
        enemies: {type: 'array', items: {$ref: '#/definitions/person'}}
      }
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      t.deepEqual(result, {label: 'root', schema: {
        definitions: {
          person: {
            type: 'object',
            properties: {
              name: {type: 'string'}
            }
          }
        },
        type: 'object',
        properties: {
          friends: {type: 'array', items: {$ref: '#/definitions/person'}},
          enemies: {type: 'array', items: {$ref: '#/definitions/person'}}
        }
      },
        dropPoints: {
          'friends': {
            label: 'person',
            schema: {
              type: 'object',
              properties: {
                name: {type: 'string'}
              }
            },
            dropPoints: {}
          },
          'enemies': {
            label: 'person',
            schema: {
              type: 'object',
              properties: {
                name: {type: 'string'}
              }
            },
            dropPoints: {}
        }
      }
      });
    });
});
test('support multiple different $ref', t => {
    const schema = {
      definitions: {
        person: {
          type: 'object',
          properties: {
            name: {type: 'string'}
          }
        },
        robot: {
          type: 'object',
          properties: {
            id: {type: 'string'}
          }
        }
      },
      type: 'object',
      properties: {
        persons: {type: 'array', items: {$ref: '#/definitions/person'}},
        robots: {type: 'array', items: {$ref: '#/definitions/robot'}}
      }
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      t.deepEqual(result, {label: 'root', schema: {
        definitions: {
          person: {
            type: 'object',
            properties: {
              name: {type: 'string'}
            }
          },
          robot: {
            type: 'object',
            properties: {
              id: {type: 'string'}
            }
          }
        },
        type: 'object',
        properties: {
          persons: {type: 'array', items: {$ref: '#/definitions/person'}},
          robots: {type: 'array', items: {$ref: '#/definitions/robot'}}
        }
      },
      dropPoints: {
        'persons': {
          label: 'person', schema: {
            type: 'object',
            properties: {
              name: {type: 'string'}
            }
          }, dropPoints: {}
        },
        'robots': {label: 'robot', schema: {
          type: 'object',
          properties: {
            id: {type: 'string'}
          }
        }, dropPoints: {}}
      }
    });
    });
});
test('support object with additionalProperties and $ref', t => {
    const schema = {
      definitions: {
        person: {
          type: 'object',
          properties: {
            name: {type: 'string'}
          }
        }
      },
      type: 'object',
      additionalProperties: {
        $ref: '#/definitions/person'
      }
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      t.deepEqual(result, {label: 'root', schema: {
        definitions: {
          person: {
            type: 'object',
            properties: {
              name: {type: 'string'}
            }
          }
        },
        type: 'object',
        additionalProperties: {
          $ref: '#/definitions/person'
        }
      },
        dropPoints: {'object': {
          label: 'person', schema: {
            type: 'object',
            properties: {
              name: {type: 'string'}
            }
          }, dropPoints: {}
        }}
      });
    });
});
test('support root anyOf', t => {
    const schema = {
      definitions: {
        a: {type: 'object'},
        b: {type: 'object'}
      },
      anyOf: [
        {$ref: '#/definitions/a'},
        {$ref: '#/definitions/b'}
      ]
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema);
    return extractor.extract().then(result => {
      t.true(isMultipleItemModel(result));
      t.deepEqual(result, {type: MULTIPLICITY_TYPES.ANY_OF, models: [
        {label: 'a', schema: {type: 'object'}, dropPoints: {}},
        {label: 'b', schema: {type: 'object'}, dropPoints: {}}
      ]});
    });
});
test('support array with anyOf', t => {
    const schema = {
      definitions: {
        a: {type: 'object'},
        b: {type: 'object'}
      },
      type: 'array',
      items: {
        anyOf: [
          {$ref: '#/definitions/a'},
          {$ref: '#/definitions/b'}
        ]
      }
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      t.deepEqual(result, {label: 'root', schema: {
        definitions: {
          a: {type: 'object'},
          b: {type: 'object'}
        },
        type: 'array',
        items: {
          anyOf: [
            {$ref: '#/definitions/a'},
            {$ref: '#/definitions/b'}
          ]
        }
      },
      dropPoints: {array: {
        type: MULTIPLICITY_TYPES.ANY_OF, models: [
          {label: 'a', schema: {type: 'object'}, dropPoints: {}},
          {label: 'b', schema: {type: 'object'}, dropPoints: {}}
        ]}}
      });
    });
});
test('support object with array with anyOf', t => {
    const schema = {
      definitions: {
        a: {type: 'object'},
        b: {type: 'object'}
      },
      type: 'object',
      properties: {
        elements: {
          type: 'array',
          items: {
            anyOf: [
              {$ref: '#/definitions/a'},
              {$ref: '#/definitions/b'}
            ]
          }
        }
      }
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      t.deepEqual(result, {label: 'root', schema: {
        definitions: {
          a: {type: 'object'},
          b: {type: 'object'}
        },
        type: 'object',
        properties: {
          elements: {
            type: 'array',
            items: {
              anyOf: [
                {$ref: '#/definitions/a'},
                {$ref: '#/definitions/b'}
              ]
            }
          }
        }
      },
      dropPoints: {
        elements: {
          type: MULTIPLICITY_TYPES.ANY_OF, models: [
            {label: 'a', schema: {type: 'object'}, dropPoints: {}},
            {label: 'b', schema: {type: 'object'}, dropPoints: {}}
          ]
        }
      }
    });
  });
});
// real world examples
test('support easy uml schema with arrays', t => {
    const schema = {
      'type': 'object',
      'properties': {
        'name': {
          'type': 'string'
        },
        'classes': {
          'type': 'array',
          'items': {
            'type': 'object',
            'properties': {
              'name': {
                'type': 'string'
              },
              'attributes': {
                'type': 'array',
                'items': {
                  'type': 'object',
                  'properties': {
                    'name': {
                      'type': 'string'
                    },
                    'type': {
                      'type': 'string',
                      'enum': ['string', 'integer']
                    }
                  }
                }
              }
            }
          }
        }
      }
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      t.deepEqual(result,
        {
          label: 'root',
          schema:
          {
            'type': 'object',
            'properties': {
              'name': {
                'type': 'string'
              },
              'classes': {
                'type': 'array',
                'items': {
                  'type': 'object',
                  'properties': {
                    'name': {
                      'type': 'string'
                    },
                    'attributes': {
                      'type': 'array',
                      'items': {
                        'type': 'object',
                        'properties': {
                          'name': {
                            'type': 'string'
                          },
                          'type': {
                            'type': 'string',
                            'enum': ['string', 'integer']
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          dropPoints: {
            'classes':
              {
                label: 'classes',
                schema:
                {
                  'type': 'object',
                  'properties': {
                    'name': {
                      'type': 'string'
                    },
                    'attributes': {
                      'type': 'array',
                      'items': {
                        'type': 'object',
                        'properties': {
                          'name': {
                            'type': 'string'
                          },
                          'type': {
                            'type': 'string',
                            'enum': ['string', 'integer']
                          }
                        }
                      }
                    }
                  }
                },
                dropPoints: {
                  attributes: {
                    label: 'attributes',
                    schema: {
                      'type': 'object',
                      'properties': {
                        'name': {
                          'type': 'string'
                        },
                        'type': {
                          'type': 'string',
                          'enum': ['string', 'integer']
                        }
                      }
                    },
                    dropPoints: {}
                  }
                }
              }
          }
        });
    });
});
test('support easy uml schema with object', t => {
    const schema = {
      'type': 'object',
      'properties': {
        'name': {
          'type': 'string'
        },
        'classes': {
          'type': 'array',
          'items': {
            'type': 'object',
            'properties': {
              'name': {
                'type': 'string'
              },
              'attributes': {
                'type': 'object',
                'additionalProperties': {
                  'type': 'object',
                  'properties': {
                    'visibility': {
                      'type': 'string',
                      'enum': ['Public', 'Private', 'Protected']
                    },
                    'type': {
                      'type': 'string',
                      'enum': ['Boolean', 'Integer', 'Real', 'String']
                    }
                  },
                  'additionalProperties': false
                }
              }
            }
          }
        }
      }
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      t.deepEqual(result,
        {
          label: 'root',
          schema:
          {
            'type': 'object',
            'properties': {
              'name': {
                'type': 'string'
              },
              'classes': {
                'type': 'array',
                'items': {
                  'type': 'object',
                  'properties': {
                    'name': {
                      'type': 'string'
                    },
                    'attributes': {
                      'type': 'object',
                      'additionalProperties': {
                        'type': 'object',
                        'properties': {
                          'visibility': {
                            'type': 'string',
                            'enum': ['Public', 'Private', 'Protected']
                          },
                          'type': {
                            'type': 'string',
                            'enum': ['Boolean', 'Integer', 'Real', 'String']
                          }
                        },
                        'additionalProperties': false
                      }
                    }
                  }
                }
              }
            }
          },
          dropPoints: {
            'classes':
              {
                label: 'classes',
                schema:
                {
                  'type': 'object',
                  'properties': {
                    'name': {
                      'type': 'string'
                    },
                    'attributes': {
                      'type': 'object',
                      'additionalProperties': {
                        'type': 'object',
                        'properties': {
                          'visibility': {
                            'type': 'string',
                            'enum': ['Public', 'Private', 'Protected']
                          },
                          'type': {
                            'type': 'string',
                            'enum': ['Boolean', 'Integer', 'Real', 'String']
                          }
                        },
                        'additionalProperties': false
                      }
                    }
                  }
                },
                dropPoints: {
                  attributes: {
                    label: 'attributes',
                    schema: {
                      'type': 'object',
                      'properties': {
                        'visibility': {
                          'type': 'string',
                          'enum': ['Public', 'Private', 'Protected']
                        },
                        'type': {
                          'type': 'string',
                          'enum': ['Boolean', 'Integer', 'Real', 'String']
                        }
                      },
                      'additionalProperties': false
                    },
                    dropPoints: {}
                  }
                }
              }
          }
        });
    });
});
test('support easy uischema control', t => {
  const schema = {
    'definitions': {
      'control': {
        'type': 'object',
        'properties': {
          'type': {
            'type': 'string',
            'enum': ['Control']
          },
          'label': { 'type': 'string' },
          'scope': {
            'type': 'object',
            'properties': {
              '$ref': { 'type': 'string' }
            }
          },
          'readOnly': { 'type': 'boolean' }
        },
        'required': ['type', 'scope'],
        'additionalProperties': false
      }
    },
    '$ref': '#/definitions/control'
  } as JsonSchema;
  const extractor = new SchemaExtractor(schema);
  return extractor.extract().then(result => {
    t.true(isItemModel(result));
    t.deepEqual(result, {
      label: 'control',
      schema: {
        'type': 'object',
        'properties': {
          'type': {
            'type': 'string',
            'enum': ['Control']
          },
          'label': { 'type': 'string' },
          'scope': {
            'type': 'object',
            'properties': {
              '$ref': { 'type': 'string' }
            }
          },
          'readOnly': { 'type': 'boolean' }
        },
        'required': ['type', 'scope'],
        'additionalProperties': false
      },
      dropPoints: {
        scope: {label: 'scope', schema: {
          'type': 'object',
          'properties': {
            '$ref': { 'type': 'string' }
          }
        }, dropPoints: {}}
      }
    });
  });
});
test('support easy uischema layout', t => {
  const schema = {
    'definitions': {
      'layout': {
        'type': 'object',
        'properties': {
          'type': {
            'type': 'string',
            'enum': ['VerticalLayout', 'HorizontalLayout', 'Group']
          },
          'label': { 'type': 'string' },
          'elements': {
            'type': 'array',
            'items': {
              'anyOf': [
                {'$ref': '#/definitions/layout'}
              ]
            }
          }
        },
        'required': ['type', 'elements'],
        'additionalProperties': false
      }
    },
    '$ref': '#/definitions/layout'
  } as JsonSchema;
  const extractor = new SchemaExtractor(schema);
  return extractor.extract().then(result => {
    t.true(isItemModel(result));
    const layout = {
      label: 'layout',
      schema: {
        'type': 'object',
        'properties': {
          'type': {
            'type': 'string',
            'enum': ['VerticalLayout', 'HorizontalLayout', 'Group']
          },
          'label': { 'type': 'string' },
          'elements': {
            'type': 'array',
            'items': {
              'anyOf': [
                {'$ref': '#/definitions/layout'}
              ]
            }
          }
        },
        'required': ['type', 'elements'],
        'additionalProperties': false
      },
      dropPoints: {
        elements: {
          models: [
          ],
          type: MULTIPLICITY_TYPES.ANY_OF}
      }
      // ,
      // fullschema: {
      //   'type': 'object',
      //   'properties': {
      //     'type': {
      //       'type': 'string',
      //       'enum': ['VerticalLayout', 'HorizontalLayout', 'Group']
      //     },
      //     'label': { 'type': 'string' },
      //     'elements': {
      //       'type': 'array',
      //       'items': {
      //         'anyOf': [
      //           {'$ref': '#/definitions/layout'}
      //         ]
      //       }
      //     }
      //   }
      // }
    } as ItemModel;
    layout.dropPoints.elements['models'].push(layout);
    t.deepEqual(result, layout);
  });
});
test('support easy uischema', t => {
    const schema = {
      'definitions': {
        'control': {
          'type': 'object',
          'properties': {
            'type': {
              'type': 'string',
              'enum': ['Control']
            },
            'label': { 'type': 'string' },
            'scope': {
              'type': 'object',
              'properties': {
                '$ref': { 'type': 'string' }
              }
            },
            'readOnly': { 'type': 'boolean' }
          },
          'required': ['type', 'scope'],
          'additionalProperties': false
        },
        'layout': {
          'type': 'object',
          'properties': {
            'type': {
              'type': 'string',
              'enum': ['VerticalLayout', 'HorizontalLayout', 'Group']
            },
            'label': { 'type': 'string' },
            'elements': {
              'type': 'array',
              'items': {
                'anyOf': [
                  {'$ref': '#/definitions/control'},
                  {'$ref': '#/definitions/layout'}
                ]
              }
            }
          },
          'required': ['type', 'elements'],
          'additionalProperties': false
        }
      },
      '$ref': '#/definitions/layout'
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      const layout = {
        label: 'layout',
        schema: {
          'type': 'object',
          'properties': {
            'type': {
              'type': 'string',
              'enum': ['VerticalLayout', 'HorizontalLayout', 'Group']
            },
            'label': { 'type': 'string' },
            'elements': {
              'type': 'array',
              'items': {
                'anyOf': [
                  {'$ref': '#/definitions/control'},
                  {'$ref': '#/definitions/layout'}
                ]
              }
            }
          },
          'required': ['type', 'elements'],
          'additionalProperties': false
        },
        // fullschema: {
        //   'type': 'object',
        //   'properties': {
        //     'type': {
        //       'type': 'string',
        //       'enum': ['VerticalLayout', 'HorizontalLayout', 'Group']
        //     },
        //     'label': { 'type': 'string' },
        //     'elements': {
        //       'type': 'array',
        //       'items': {
        //         'anyOf': [
        //           {'$ref': '#/definitions/control'},
        //           {'$ref': '#/definitions/layout'}
        //         ]
        //       }
        //     }
        //   },
        //   'required': ['type', 'elements'],
        //   'additionalProperties': false
        // },
        dropPoints: {
          elements: {
            models: [
              {label: 'control', schema: {
                'type': 'object',
                'properties': {
                  'type': {
                    'type': 'string',
                    'enum': ['Control']
                  },
                  'label': { 'type': 'string' },
                  'scope': {
                    'type': 'object',
                    'properties': {
                      '$ref': { 'type': 'string' }
                    }
                  },
                  'readOnly': { 'type': 'boolean' }
                },
                'required': ['type', 'scope'],
                'additionalProperties': false
              }, dropPoints: {
                scope: {label: 'scope', schema: {
                  'type': 'object',
                  'properties': {
                    '$ref': { 'type': 'string' }
                  }
                }, dropPoints: {}
                // ,
                // fullschema: {
                //   'type': 'object',
                //   'properties': {
                //     'type': {
                //       'type': 'string',
                //       'enum': ['VerticalLayout', 'HorizontalLayout', 'Group']
                //     },
                //     'label': { 'type': 'string' },
                //     'elements': {
                //       'type': 'array',
                //       'items': {
                //         'anyOf': [
                //           {'$ref': '#/definitions/control'},
                //           {'$ref': '#/definitions/layout'}
                //         ]
                //       }
                //     }
                //   },
                //   'required': ['type', 'elements'],
                //   'additionalProperties': false
                // }
              }
              }
              // ,
              // fullschema: {
              //   'type': 'object',
              //   'properties': {
              //     'type': {
              //       'type': 'string',
              //       'enum': ['VerticalLayout', 'HorizontalLayout', 'Group']
              //     },
              //     'label': { 'type': 'string' },
              //     'elements': {
              //       'type': 'array',
              //       'items': {
              //         'anyOf': [
              //           {'$ref': '#/definitions/control'},
              //           {'$ref': '#/definitions/layout'}
              //         ]
              //       }
              //     }
              //   },
              //   'required': ['type', 'elements'],
              //   'additionalProperties': false
              // }
            }
            ],
            type: MULTIPLICITY_TYPES.ANY_OF}
        }
      } as ItemModel;
      layout.dropPoints.elements['models'].push(layout);
      t.deepEqual(result, layout);
    });
});
test('support for array references', t => {
    const schema = {
      definitions: {
        class: {
          type: 'object',
          properties: {
            id: {
              type: 'string'
            },
            name: {
              type: 'string'
            },
            associations: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'integer',
                    minimum: 0
                  }
                },
                links: [{
                  rel: 'full',
                  href: '#/classes/{id}',
                  targetSchema: '#/definitions/class'
                }]
              }
            }
          }
        }
      },
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        classes: {
          type: 'array',
          items: {
            $ref: '#/definitions/class'
          }
        }
      }
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      const classSchema = {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          name: {
            type: 'string'
          },
          associations: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                  minimum: 0
                }
              },
              links: [{
                rel: 'full',
                href: '#/classes/{id}',
                targetSchema: '#/definitions/class'
              }]
            }
          }
        }
      };
      const classModel = {
        label: 'class',
        schema: classSchema,
        dropPoints: {
          associations: {
            label: 'associations',
            href: '#/classes/{id}',
            schema: {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                  minimum: 0
                }
              },
              links: [{
                rel: 'full',
                href: '#/classes/{id}',
                targetSchema: '#/definitions/class'
              }]
            }
          }
        }
      };
      classModel.dropPoints.associations['targetModel'] = classModel;
      t.deepEqual(result,
        {
          label: 'root',
          schema: {
            definitions: {
              class: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string'
                  },
                  name: {
                    type: 'string'
                  },
                  associations: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'integer',
                          minimum: 0
                        }
                      },
                      links: [{
                        rel: 'full',
                        href: '#/classes/{id}',
                        targetSchema: '#/definitions/class'
                      }]
                    }
                  }
                }
              }
            },
            type: 'object',
            properties: {
              name: {
                type: 'string'
              },
              classes: {
                type: 'array',
                items: {
                  $ref: '#/definitions/class'
                }
              }
            }
          },
          dropPoints: {
            classes: classModel
          }
        });
    });
});
test('support for object references', t => {
    const schema = {
      definitions: {
        class: {
          type: 'object',
          properties: {
            id: {
              type: 'string'
            },
            association: {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                  minimum: 0
                }
              },
              links: [{
                rel: 'full',
                href: '#/classes/{id}',
                targetSchema: '#/definitions/class'
              }]
            }
          }
        }
      },
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        classes: {
          type: 'array',
          items: {
            $ref: '#/definitions/class'
          }
        }
      }
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      const classSchema = {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          association: {
            type: 'object',
            properties: {
              id: {
                type: 'integer',
                minimum: 0
              }
            },
            links: [{
              rel: 'full',
              href: '#/classes/{id}',
              targetSchema: '#/definitions/class'
            }]
          }
        }
      };
      const classModel = {
        label: 'class',
        schema: classSchema,
        dropPoints: {
          association: {
            label: 'association',
            href: '#/classes/{id}',
            schema: {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                  minimum: 0
                }
              },
              links: [{
                rel: 'full',
                href: '#/classes/{id}',
                targetSchema: '#/definitions/class'
              }]
            }
          }
        }
      };
      classModel.dropPoints.association['targetModel'] = classModel;
      t.deepEqual(result,
        {
          label: 'root',
          schema: {
            definitions: {
              class: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string'
                  },
                  association: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'integer',
                        minimum: 0
                      }
                    },
                    links: [{
                      rel: 'full',
                      href: '#/classes/{id}',
                      targetSchema: '#/definitions/class'
                    }]
                  }
                }
              }
            },
            type: 'object',
            properties: {
              name: {
                type: 'string'
              },
              classes: {
                type: 'array',
                items: {
                  $ref: '#/definitions/class'
                }
              }
            }
          },
          dropPoints: {
            classes: classModel
          }
        });
    });
});
test('support for inline references', t => {
    const schema = {
      definitions: {
        class: {
          type: 'object',
          properties: {
            id: {
              type: 'string'
            },
            association: {
              type: 'integer',
              minimum: 0
            },
            composition: {
              type: 'integer',
              minimum: 0
            }
          },
          links: [{
            rel: 'full',
            href: '#/classes/{association}',
            targetSchema: '#/definitions/class'
          },
          {
            rel: 'full',
            href: '#/classes/{composition}',
            targetSchema: '#/definitions/class'
          }]
        }
      },
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        classes: {
          type: 'array',
          items: {
            $ref: '#/definitions/class'
          }
        }
      }
    } as JsonSchema;
    const extractor = new SchemaExtractor(schema);
    return extractor.extract().then(result => {
      t.true(isItemModel(result));
      const classSchema = {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          association: {
            type: 'integer',
            minimum: 0
          },
          composition: {
            type: 'integer',
            minimum: 0
          }
        },
        links: [{
          rel: 'full',
          href: '#/classes/{association}',
          targetSchema: '#/definitions/class'
        },
        {
          rel: 'full',
          href: '#/classes/{composition}',
          targetSchema: '#/definitions/class'
        }]
      };
      const classModel = {
        label: 'class',
        schema: classSchema,
        dropPoints: {
          association: {
            label: 'association',
            href: '#/classes/{association}',
            schema: {
              type: 'integer',
              minimum: 0
            }
          },
          composition: {
            label: 'composition',
            href: '#/classes/{composition}',
            schema: {
              type: 'integer',
              minimum: 0
            }
          }
        }
      };
      classModel.dropPoints.association['targetModel'] = classModel;
      classModel.dropPoints.composition['targetModel'] = classModel;
      t.deepEqual(result,
        {
          label: 'root',
          schema: {
            definitions: {
              class: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string'
                  },
                  association: {
                    type: 'integer',
                    minimum: 0
                  },
                  composition: {
                    type: 'integer',
                    minimum: 0
                  }
                },
                links: [{
                  rel: 'full',
                  href: '#/classes/{association}',
                  targetSchema: '#/definitions/class'
                },
                {
                  rel: 'full',
                  href: '#/classes/{composition}',
                  targetSchema: '#/definitions/class'
                }]
              }
            },
            type: 'object',
            properties: {
              name: {
                type: 'string'
              },
              classes: {
                type: 'array',
                items: {
                  $ref: '#/definitions/class'
                }
              }
            }
          },
          dropPoints: {
            classes: classModel
          }
        });
    });
});
