import { Repository, Like, Equal } from 'typeorm';

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

Repository.prototype.findAll = async function (page, size, order, options) {
  return Promise.all([
    this.find({
      relations: Object.fromEntries(
        this.getRelationNames().map((name) => [name, true])
      ),
      skip: page * size,
      take: size,
      order,
      ...options
    }),
    this.count(options)
  ]).then(([content, totalElements]) => ({
    content,
    totalElements
  }));
};

Repository.prototype.filter = function (params) {
  return {
    where: Object.fromEntries(
      Object.entries(params).map(([k, v]) => {
        const column = this.metadata.findColumnWithPropertyName(k);
        const type = this.manager.connection.driver.normalizeType(column);
        return [
          k,
          type === 'varchar' || type === 'text' ? Like(`%${v}%`) : Equal(v)
        ];
      })
    )
  };
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
