import { In } from 'typeorm';

import '../common/repository/base.repository';

export default {
  findByContent(resource, name) {
    return this.findOne({
      loadEagerRelations: false,
      select: {
        id: true,
        contents: {
          findOne: true,
          findOptions: true
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
  findByComponent(resource, name) {
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
  findByConfig(resource, name) {
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
  findResources() {
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
        }
      }
    });
  }
};
