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
  list: '',
  create: '',
  edit: '',
  contents: [
    {
      name: `content${id}`,
      findOne: false,
      findOptions: '{}'
    }
  ],
  components: [
    {
      name: `component${id}`,
      element: 'e'
    }
  ]
});
