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
        userId: {
          type: 'varchar',
          nullable: true
        },
        date: {
          type: 'date',
          nullable: true
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
        settings: {
          type: 'one-to-many',
          target: 'setting',
          eager: true,
          cascade: true,
          inverseSide: 'schema'
        },
        events: {
          type: 'one-to-many',
          target: 'event',
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
          synchronize: false,
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
      name: 'setting',
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
          inverseSide: 'settings'
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
      name: 'event',
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
          inverseSide: 'events'
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
