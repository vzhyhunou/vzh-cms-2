import { Repository, In } from 'typeorm';

Repository.prototype.getPrimaryColumnName = function () {
  return this.metadata.primaryColumns[0].propertyName;
};

Repository.prototype.findById = function (id) {
  return this.findOneBy({ [this.getPrimaryColumnName()]: id });
};

Repository.prototype.findByIdIn = function (ids) {
  return this.findBy({ [this.getPrimaryColumnName()]: In(ids) });
};
