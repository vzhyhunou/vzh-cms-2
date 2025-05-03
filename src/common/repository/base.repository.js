import { Repository } from 'typeorm';

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

Repository.prototype.findAll = async function (page, size, order) {
  return Promise.all([
    this.find({
      relations: Object.fromEntries(
        this.getRelationNames().map((name) => [name, true])
      ),
      skip: page * size,
      take: size,
      order
    }),
    this.count()
  ]).then(([content, totalElements]) => ({
    content,
    totalElements
  }));
};
