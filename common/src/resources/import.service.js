const SCHEMA = 'schema';

export class AbstractImportService {
  constructor(schemasService, logger) {
    this.schemasService = schemasService;
    this.logger = logger;
  }

  async imp() {
    this.logger.log('Import schema');
    await this.consume(
      (resource) => resource === SCHEMA,
      (id) => id === SCHEMA,
      (item) => item
    );
    this.logger.log('Import schemas');
    await this.consume(
      (resource) => resource === SCHEMA,
      (id) => id !== SCHEMA,
      (item) => item
    );
    this.logger.log('Import items without relations');
    const columns = await this.schemasService.findColumns();
    await this.consume(
      (resource) => resource !== SCHEMA,
      () => true,
      (item, resource) =>
        Object.fromEntries(
          Object.entries(item).filter(([k]) => columns[resource].includes(k))
        )
    );
    this.logger.log('Import items');
    await this.consume(
      (resource) => resource !== SCHEMA,
      () => true,
      (item) => item
    );
    this.logger.log('End import');
  }
}
