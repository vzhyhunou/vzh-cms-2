const SCHEMA = 'schema';

export class AbstractImportService {
  constructor(schemasService, logger) {
    this.schemasService = schemasService;
    this.logger = logger;
  }

  async imp() {
    this.logger.log('Import [1/4]');
    await this.consume(
      (resource) => resource === SCHEMA,
      (id) => id === SCHEMA,
      (item) => item
    );
    this.logger.log('Import [2/4]');
    await this.consume(
      (resource) => resource === SCHEMA,
      (id) => id !== SCHEMA,
      (item) => item
    );
    this.logger.log('Import [3/4]');
    const columns = await this.schemasService.findColumns();
    await this.consume(
      (resource) => resource !== SCHEMA,
      () => true,
      (item, resource) =>
        Object.fromEntries(
          Object.entries(item).filter(([k]) => columns[resource].includes(k))
        )
    );
    this.logger.log('Import [4/4]');
    await this.consume(
      (resource) => resource !== SCHEMA,
      () => true,
      (item) => item
    );
  }
}
