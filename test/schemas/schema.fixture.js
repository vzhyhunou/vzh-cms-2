export default (id) => ({
  id,
  entities: [
    `{
      name: '${id}',
      columns: {
        id: {
          type: 'varchar',
          primary: true
        },
        data: {
          type: 'varchar',
          nullable: true
        }
      }
    }`
  ],
  config: [
    {
      name: `config${id}`,
      value: 'v'
    }
  ],
  contents: [
    {
      name: `content${id}`,
      findOne: false,
      findOptions: '{}'
    }
  ],
  components: [
    {
      name: `list`,
      element: 'l'
    },
    {
      name: `create`,
      element: 'c'
    },
    {
      name: `edit`,
      element: 'e'
    },
    {
      name: `component${id}`,
      element: 'a'
    }
  ]
});
