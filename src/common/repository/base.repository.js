import { Repository, In } from 'typeorm';
import * as typeorm from 'typeorm';

Repository.prototype.getPrimaryColumnName = function () {
  return this.metadata.primaryColumns[0].propertyName;
};

Repository.prototype.findById = function (id) {
  return this.findOneBy({ [this.getPrimaryColumnName()]: id });
};

Repository.prototype.findByIdIn = function (ids) {
  return this.findBy({ [this.getPrimaryColumnName()]: In(ids) });
};

Repository.prototype.findAll = async function (page, size, order, filter) {
  return Promise.all([
    this.find({
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
  return new Function(
    ...Object.keys(params),
    ...Object.keys(typeorm),
    `return ${value}`
  )(...Object.values(params), ...Object.values(typeorm));
};

Repository.prototype.findByIndex = function (index) {
  return this.findOne({
    skip: index,
    take: 1,
    where: {}
  });
};
