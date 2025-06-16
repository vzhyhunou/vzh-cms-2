export default (id) => ({
  id,
  entities: [
    `{
      "name": "${id}",
      "columns": {
        "id": {
          "type": "varchar",
          "primary": true
        }
      }
    }`
  ],
  list: '',
  edit: '',
  components: [
    {
      name: `${id}`,
      findOne: false,
      findOptions: '{}',
      element: ''
    }
  ]
});
