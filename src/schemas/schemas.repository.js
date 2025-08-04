import '../common/repository/base.repository';

export default {
  findByContent(resource, name) {
    return this.createQueryBuilder('schema')
      .leftJoin('schema.contents', 'content')
      .select(['schema.id', 'content.findOne', 'content.findOptions'])
      .where('schema.id = :resource', { resource })
      .andWhere('content.name = :name', { name })
      .getOne();
  },
  findByComponent(resource, name) {
    return this.createQueryBuilder('schema')
      .leftJoin('schema.components', 'component')
      .select(['schema.id', 'component.element'])
      .where('schema.id = :resource', { resource })
      .andWhere('component.name = :name', { name })
      .getOne();
  },
  findByConfig(resource, name) {
    return this.createQueryBuilder('schema')
      .leftJoin('schema.config', 'config')
      .select(['schema.id', 'config.value'])
      .where('schema.id = :resource', { resource })
      .andWhere('config.name = :name', { name })
      .getOne();
  },
  getResources() {
    return this.createQueryBuilder('schema')
      .leftJoin('schema.components', 'component')
      .select(['schema.id', 'component.name', 'component.element'])
      .where('component.name in (:...names)', {
        names: ['list', 'create', 'edit']
      })
      .getMany();
  }
};
