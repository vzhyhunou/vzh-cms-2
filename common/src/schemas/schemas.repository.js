import { In } from 'typeorm';

import '../common/base.repository';

export default {
  findField(...fields) {
    return this.find({
      loadEagerRelations: false,
      select: {
        id: true,
        ...Object.fromEntries(fields.map((field) => [field, true]))
      }
    });
  },
  findResourceField(resource, name) {
    return this.findOne({
      loadEagerRelations: false,
      select: {
        [name]: true
      },
      where: {
        id: resource
      }
    });
  },
  findRelation(relation, name) {
    return this.find({
      loadEagerRelations: false,
      select: {
        id: true
      },
      relations: {
        [relation]: true
      },
      where: {
        [relation]: {
          name
        }
      }
    });
  },
  findResourceRelation(resource, relation, name) {
    return this.findOne({
      loadEagerRelations: false,
      select: {
        id: true
      },
      relations: {
        [relation]: true
      },
      where: {
        id: resource,
        [relation]: {
          name
        }
      }
    });
  },
  findResources(authorities) {
    return this.find({
      loadEagerRelations: false,
      select: {
        id: true,
        components: {
          name: true,
          element: true
        }
      },
      relations: {
        components: true
      },
      where: {
        components: {
          name: In(['List', 'Create', 'Edit', 'Icon'])
        },
        editor: In(authorities)
      }
    });
  }
};
