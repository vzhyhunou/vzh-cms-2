export default (id) => ({
  id,
  entities: [
    `{
      "name": "${id}",
      "columns": {
        "id": {
          "type": "varchar",
          "primary": true
        },
        "f": {
          "type": "varchar",
          "nullable": true
        }
      }
    }`
  ],
  list: '',
  edit: ''
});
