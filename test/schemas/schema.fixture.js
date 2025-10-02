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
  settings: '{}',
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
  ],
  events: [
    {
      name: `event${id}`,
      value: 'v'
    },
    {
      name: `event${id}2`,
      value: 'v'
    }
  ]
});
