export default (id) => ({
  id,
  value: JSON.stringify({
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
  })
});
