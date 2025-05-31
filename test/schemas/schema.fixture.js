export default (id) => ({
  id,
  entity: `{
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
  }`,
  list: '',
  edit: ''
});
