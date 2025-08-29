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

export const parse = (value, params = {}) =>
  new Function(
    ...Object.keys(params),
    ...Object.keys(typeorm),
    `return ${value}`
  )(...Object.values(params), ...Object.values(typeorm));
