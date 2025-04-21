import { SelectQueryBuilder, Repository } from 'typeorm';

Repository.prototype.findAll = async function ({ page, size, sort }) {
  const [content, totalElements] = await Promise.all([
    this.find({
      skip: page * size,
      take: size,
      order: sort && (([field, order]) => ({ [field]: order }))(sort)
    }),
    this.count()
  ]);
  return {
    content,
    totalElements
  };
};

SelectQueryBuilder.prototype.andWhereLike = function (
  expression,
  field,
  preffix,
  suffix
) {
  field &&
    this.andWhere(`lower(${expression}) like :${expression}`, {
      [expression]: `${preffix}${field.toLowerCase()}${suffix}`
    });
  return this;
};

SelectQueryBuilder.prototype.andWhereContains = function (expression, field) {
  return this.andWhereLike(expression, field, '%', '%');
};

SelectQueryBuilder.prototype.andWhereInQuery = function (expression, builder) {
  return this.andWhere(
    `${expression} in (${builder.getQuery()})`,
    builder.getParameters()
  );
};

SelectQueryBuilder.prototype.orderByName = function (resource, sort) {
  sort &&
    (([field, order]) => this.orderBy(`${resource}.${field}`, order))(sort);
  return this;
};

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
