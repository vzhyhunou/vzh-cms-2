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
  settings: [
    {
      name: `setting${id}`,
      value: 'v'
    },
    {
      name: `setting${id}2`,
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
      name: `Component${id}`,
      element: 'a'
    }
  ]
});
