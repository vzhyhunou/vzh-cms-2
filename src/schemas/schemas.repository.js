import { In } from 'typeorm';

import '../common/repository/base.repository';

export default {
  findContent(resource, name) {
    return this.findOne({
      loadEagerRelations: false,
      select: {
        id: true,
        contents: {
          single: true,
          options: true,
          projection: true
        }
      },
      relations: {
        contents: true
      },
      where: {
        id: resource,
        contents: {
          name
        }
      }
    });
  },
  findComponent(resource, name) {
    return this.findOne({
      loadEagerRelations: false,
      select: {
        id: true,
        components: {
          element: true
        }
      },
      relations: {
        components: true
      },
      where: {
        id: resource,
        components: {
          name
        }
      }
    });
  },
  findField(name) {
    return this.find({
      loadEagerRelations: false,
      select: {
        id: true,
        [name]: true
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
