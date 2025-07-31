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
  data: [],
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
      element: ''
    }
  ]
});
