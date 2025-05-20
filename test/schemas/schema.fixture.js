export default (id) => ({
  id,
  value: {
    name: id,
    columns: {
      id: {
        type: 'varchar',
        primary: true
      },
      f: {
        type: 'varchar',
        nullable: true
      }
    }
  }
});
