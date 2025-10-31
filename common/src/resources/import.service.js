const SCHEMA = 'schema';

export class AbstractImportService {
  constructor(schemasService) {
    this.schemasService = schemasService;
  }

  async imp() {
    this.log('Import schema');
    await this.consume(
      (resource) => resource === SCHEMA,
      (id) => id === SCHEMA,
      (item) => item
    );
    this.log('Import schemas');
    await this.consume(
      (resource) => resource === SCHEMA,
      (id) => id !== SCHEMA,
      (item) => item
    );
    this.log('Import items without relations');
    const columns = await this.schemasService.findColumns();
    await this.consume(
      (resource) => resource !== SCHEMA,
      () => true,
      (item, resource) =>
        Object.fromEntries(
          Object.entries(item).filter(([k]) => columns[resource].includes(k))
        )
    );
    this.log('Import items');
    await this.consume(
      (resource) => resource !== SCHEMA,
      () => true,
      (item) => item
    );
    this.log('End import');
  }
}
