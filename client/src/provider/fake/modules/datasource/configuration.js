import { EntitySchema } from 'typeorm';
import sqlJs from 'sql.js';

import fileSchema from './file.schema.json';

export default {
  type: 'sqljs',
  driver: sqlJs,
  sqlJsConfig: {
    locateFile: () => `/sql-wasm.wasm`
  },
  entities: [new EntitySchema(fileSchema)],
  logging: true
};
