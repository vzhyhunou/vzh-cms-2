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
  findConfig(resource, name) {
    return this.findOne({
      loadEagerRelations: false,
      select: {
        id: true,
        config: {
          value: true
        }
      },
      relations: {
        config: true
      },
      where: {
        id: resource,
        config: {
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
          name: In(['list', 'create', 'edit'])
        },
        editor: In(authorities)
      }
    });
  },
  findEditors() {
    return this.find({
      loadEagerRelations: false,
      select: {
        id: true,
        editor: true
      }
    });
  }
};
