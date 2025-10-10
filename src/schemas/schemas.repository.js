import { In } from 'typeorm';

import '../common/repository/base.repository';

export default {
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
  findField(field) {
    return this.find({
      loadEagerRelations: false,
      select: {
        id: true,
        [field]: true
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
          name: In(['List', 'Create', 'Edit'])
        },
        editor: In(authorities)
      }
    });
  },
  findMessages(locale) {
    return this.find({
      loadEagerRelations: false,
      select: {
        id: true,
        messages: {
          value: true
        }
      },
      relations: {
        messages: true
      },
      where: {
        messages: {
          locale
        }
      }
    });
  }
};
