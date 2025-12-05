export default {
  id: 'schema',
  entities: [
    `{
      name: 'schema',
      columns: {
        id: {
          type: 'varchar',
          primary: true
        },
        entities: {
          type: 'simple-json'
        },
        editor: {
          type: 'varchar'
        },
        clientSettings: {
          type: 'text',
          nullable: true
        },
        serverSettings: {
          type: 'text',
          nullable: true
        },
        parse: {
          type: 'text',
          nullable: true
        },
        format: {
          type: 'text',
          nullable: true
        },
        updatedBy: {
          type: 'varchar',
          nullable: true
        },
        updatedAt: {
          type: 'date',
          nullable: true,
          updateDate: true
        }
      },
      relations: {
        contents: {
          type: 'one-to-many',
          target: 'content',
          eager: true,
          cascade: true,
          inverseSide: 'schema'
        },
        components: {
          type: 'one-to-many',
          target: 'component',
          eager: true,
          cascade: true,
          inverseSide: 'schema'
        },
        messages: {
          type: 'one-to-many',
          target: 'messages',
          eager: true,
          cascade: true,
          inverseSide: 'schema'
        }
      }
    }`,
    `{
      name: 'content',
      columns: {
        id: {
          type: 'int',
          primary: true,
          generated: true
        },
        name: {
          type: 'varchar'
        },
        single: {
          type: 'boolean',
          nullable: true
        },
        options: {
          type: 'text'
        },
        projection: {
          type: 'text',
          nullable: true
        }
      },
      relations: {
        schema: {
          type: 'many-to-one',
          target: 'schema',
          onDelete: 'CASCADE',
          orphanedRowAction: 'delete',
          inverseSide: 'contents'
        }
      },
      indices: [
        {
          unique: true,
          columns: ['schema', 'name']
        }
      ]
    }`,
    `{
      name: 'component',
      columns: {
        id: {
          type: 'int',
          primary: true,
          generated: true
        },
        name: {
          type: 'varchar'
        },
        element: {
          type: 'text'
        }
      },
      relations: {
        schema: {
          type: 'many-to-one',
          target: 'schema',
          onDelete: 'CASCADE',
          orphanedRowAction: 'delete',
          inverseSide: 'components'
        }
      },
      indices: [
        {
          synchronize: false,
          unique: true,
          columns: ['schema', 'name']
        }
      ]
    }`,
    `{
      name: 'messages',
      columns: {
        id: {
          type: 'int',
          primary: true,
          generated: true
        },
        name: {
          type: 'varchar'
        },
        value: {
          type: 'text'
        }
      },
      relations: {
        schema: {
          type: 'many-to-one',
          target: 'schema',
          onDelete: 'CASCADE',
          orphanedRowAction: 'delete',
          inverseSide: 'messages'
        }
      },
      indices: [
        {
          synchronize: false,
          unique: true,
          columns: ['schema', 'name']
        }
      ]
    }`
  ],
  editor: `editorschema`
};
