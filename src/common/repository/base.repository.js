import { SelectQueryBuilder, Repository } from 'typeorm';

Repository.prototype.findAll = async function ({ page, size, sort }) {
  return Promise.all([
    this.find({
      skip: page * size,
      take: size,
      order: sort && (([field, order]) => ({ [field]: order }))(sort)
    }),
    this.count()
  ]).then(([content, totalElements]) => ({
    content,
    totalElements
  }));
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
