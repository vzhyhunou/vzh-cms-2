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
  findSettings() {
    return this.find({
      loadEagerRelations: false,
      select: {
        id: true,
        settings: true
      }
    });
  },
  findEvent(resource, name) {
    return this.findOne({
      loadEagerRelations: false,
      select: {
        id: true,
        events: {
          value: true
        }
      },
      relations: {
        events: true
      },
      where: {
        id: resource,
        events: {
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
          name: In(['List', 'Create', 'Edit'])
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
