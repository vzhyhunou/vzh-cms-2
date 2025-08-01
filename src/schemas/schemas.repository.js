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
  }
};
