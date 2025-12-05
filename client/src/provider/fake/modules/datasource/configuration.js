import { EntitySchema } from 'typeorm';
import sqlJs from 'sql.js';

import fileSchema from './file.schema.json';

export default {
  type: 'sqljs',
  driver: sqlJs,
  sqlJsConfig: {
    locateFile: (path, prefix) => `${prefix || '/'}${path}`
  },
  entities: [new EntitySchema(fileSchema)],
  logging: true,
  synchronize: true
};
