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
  editor: `editor`,
  settings: '{}',
  parse: 'target',
  format: 'target',
  contents: [
    {
      name: `content`,
      options: '{}'
    },
    {
      name: `content2`,
      options: '{}'
    }
  ],
  components: [
    {
      name: `List`,
      element: 'l'
    },
    {
      name: `Create`,
      element: 'c'
    },
    {
      name: `Edit`,
      element: 'e'
    },
    {
      name: `Component`,
      element: 'a'
    }
  ]
});
