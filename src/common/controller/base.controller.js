export class BaseController {
  queryParam(value) {
    return Object.fromEntries(
      ((sort) => sort.map((s) => s.split(',')))(
        Array.isArray(value) ? value : [value]
      )
    );
  }

  findAll(repository, { page = 0, size = 20, sort = [] }) {
    return repository
      .findAll(page, size, this.queryParam(sort))
      .then(({ content, totalElements }) => ({
        content,
        page: {
          totalElements
        }
      }));
  }
}
