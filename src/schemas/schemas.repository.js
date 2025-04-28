import '../common/repository/base.repository';

export default {
  async list({ id }, { page, size, sort }) {
    const filter = this.createQueryBuilder('schema')
      .select('schema.id')
      .andWhereContains('schema.id', id);

    const b = this.createQueryBuilder('schema')
      .select(['schema.id'])
      .andWhereInQuery('schema.id', filter)
      .orderByName('schema', sort)
      .skip(page * size)
      .take(size)
      .getMany();

    const c = this.createQueryBuilder('schema')
      .andWhereInQuery('schema.id', filter)
      .getCount();

    const [content, totalElements] = await Promise.all([b, c]);
    return {
      content,
      totalElements
    };
  }
};
