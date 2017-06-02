export const schema = {
  'definitions': {
    'Room': {
      'type': 'array',
      'items': {
        'type': 'object',
        'properties': {
          'name': {
            'type': 'string'
          },
          'type': {
            'type': 'string',
            'enum': [
              'Public',
              'Private'
            ]
          },
          'description': {
            'type': 'string'
          }
        }
      }
    },
    'Floor': {
      'type': 'array',
      'items': {
        'type': 'object',
        'properties': {
          'number': {
            'type': 'string'
          },
          'Rooms': {
            '$ref': '#/definitions/Room'
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
    'Buildings': {
      'type': 'array',
      'items': {
        'type': 'object',
        'properties': {
          'name': {
            'type': 'string'
          },
          'street': {
            'type': 'string'
          },
          'city': {
            'type': 'string'
          },
          'state': {
            'type': 'string'
          },
          'Blocks': {
            'type': 'array',
            'items': {
              'type': 'object',
              'properties': {
                'name': {
                  'type': 'string'
                },
                'Floors': {
                  '$ref': '#/definitions/Floor'
                }
              }
            }
          },
          'Floors': {
            '$ref': '#/definitions/Floor'
          }
        }
      }
    }
  }
};

export const schema_only_refs = {
  'definitions': {
    'Room': {
      'type': 'array',
      'items': {
        'type': 'object',
        'properties': {
          'name': {
            'type': 'string'
          },
          'type': {
            'type': 'string',
            'enum': [
              'Public',
              'Private'
            ]
          },
          'description': {
            'type': 'string'
          }
        }
      }
    },
    'Floor': {
      'type': 'array',
      'items': {
        'type': 'object',
        'properties': {
          'number': {
            'type': 'string'
          },
          'Rooms': {
            '$ref': '#/definitions/Room'
          }
        }
      }
    },
    'Blocks': {
      'type': 'array',
      'items': {
        'type': 'object',
        'properties': {
          'name': {
            'type': 'string'
          },
          'Floors': {
            '$ref': '#/definitions/Floor'
          }
        }
      }
    },
    'Buildings': {
      'type': 'array',
      'items': {
        'type': 'object',
        'properties': {
          'name': {
            'type': 'string'
          },
          'street': {
            'type': 'string'
          },
          'city': {
            'type': 'string'
          },
          'state': {
            'type': 'string'
          },
          'Blocks': {
            '$ref': '#/definitions/Blocks'
          },
          'Floors': {
            '$ref': '#/definitions/Floor'
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
    'Buildings': {
      '$ref': '#/definitions/Buildings'
    }
  }
};

export const schema_no_refs = {
  'definitions': {
    'Room': {
      'type': 'array',
      'items': {
        'type': 'object',
        'properties': {
          'name': {
            'type': 'string'
          },
          'type': {
            'type': 'string',
            'enum': [
              'Public',
              'Private'
            ]
          },
          'description': {
            'type': 'string'
          }
        }
      }
    },
    'Floor': {
      'type': 'array',
      'items': {
        'type': 'object',
        'properties': {
          'number': {
            'type': 'string'
          },
          'Rooms': {
            'type': 'array',
            'items': {
              'type': 'object',
              'properties': {
                'name': {
                  'type': 'string'
                },
                'type': {
                  'type': 'string',
                  'enum': [
                    'Public',
                    'Private'
                  ]
                },
                'description': {
                  'type': 'string'
                }
              }
            }
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
    'Buildings': {
      'type': 'array',
      'items': {
        'type': 'object',
        'properties': {
          'name': {
            'type': 'string'
          },
          'street': {
            'type': 'string'
          },
          'city': {
            'type': 'string'
          },
          'state': {
            'type': 'string'
          },
          'Blocks': {
            'type': 'array',
            'items': {
              'type': 'object',
              'properties': {
                'name': {
                  'type': 'string'
                },
                'Floors': {
                  'type': 'array',
                  'items': {
                    'type': 'object',
                    'properties': {
                      'number': {
                        'type': 'string'
                      },
                      'Rooms': {
                        'type': 'array',
                        'items': {
                          'type': 'object',
                          'properties': {
                            'name': {
                              'type': 'string'
                            },
                            'type': {
                              'type': 'string',
                              'enum': [
                                'Public',
                                'Private'
                              ]
                            },
                            'description': {
                              'type': 'string'
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          'Floors': {
            'type': 'array',
            'items': {
              'type': 'object',
              'properties': {
                'number': {
                  'type': 'string'
                },
                'Rooms': {
                  'type': 'array',
                  'items': {
                    'type': 'object',
                    'properties': {
                      'name': {
                        'type': 'string'
                      },
                      'type': {
                        'type': 'string',
                        'enum': [
                          'Public',
                          'Private'
                        ]
                      },
                      'description': {
                        'type': 'string'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};
