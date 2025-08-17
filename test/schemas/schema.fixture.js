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
  editor: `editor${id}`,
  config: [
    {
      name: `config${id}`,
      value: 'v'
    },
    {
      name: `config${id}2`,
      value: 'v'
    }
  ],
  contents: [
    {
      name: `content${id}`,
      options: '{}'
    },
    {
      name: `content${id}2`,
      options: '{}'
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
