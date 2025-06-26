import { Repository, In } from 'typeorm';
import * as typeorm from 'typeorm';

Repository.prototype.getRelationNames = function () {
  return this.metadata.relations.map(({ propertyName }) => propertyName);
};

Repository.prototype.getPrimaryColumnName = function () {
  return this.metadata.primaryColumns[0].propertyName;
};

Repository.prototype.findById = function (id) {
  return this.findOne({
    relations: Object.fromEntries(
      this.getRelationNames().map((name) => [name, true])
    ),
    where: { [this.getPrimaryColumnName()]: id }
  });
};

Repository.prototype.removeById = function (id) {
  return this.remove({
    [this.getPrimaryColumnName()]: id
  });
};

Repository.prototype.findByIdIn = function (ids) {
  return this.find({
    relations: Object.fromEntries(
      this.getRelationNames().map((name) => [name, true])
    ),
    where: { [this.getPrimaryColumnName()]: In(ids) }
  });
};

Repository.prototype.findAll = async function (page, size, order, filter) {
  return Promise.all([
    this.find({
      relations: Object.fromEntries(
        this.getRelationNames().map((name) => [name, true])
      ),
      where: filter,
      skip: page * size,
      take: size,
      order
    }),
    this.count({ where: filter })
  ]).then(([content, totalElements]) => ({
    content,
    totalElements
  }));
};

Repository.prototype.options = function (value, params = {}) {
  try {
    return new Function(
      ...Object.keys(params),
      ...Object.keys(typeorm),
      `return ${value}`
    )(...Object.values(params), ...Object.values(typeorm));
  } catch (e) {
    return value;
  }
};

Repository.prototype.findByIndex = function (index) {
  return this.findOne({
    relations: Object.fromEntries(
      this.getRelationNames().map((name) => [name, true])
    ),
    skip: index,
    take: 1,
    where: {}
  });
};
