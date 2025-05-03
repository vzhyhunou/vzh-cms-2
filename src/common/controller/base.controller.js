export class BaseController {
  queryParam(value) {
    return Object.fromEntries(
      ((sort) => sort.map((s) => s.split(',')))(
        Array.isArray(value) ? value : [value]
      )
    );
  }
}
