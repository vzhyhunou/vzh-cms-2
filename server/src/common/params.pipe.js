import { Injectable } from '@nestjs/common';

@Injectable()
export class ParamsPipe {
  transform({ ids = [], page = 0, size = 20, sort = [], parse = [], ...rest }) {
    return {
      ids: Array.isArray(ids) ? ids : [ids],
      page,
      size,
      sort: Object.fromEntries(
        ((sort) => sort.map((s) => s.split(',')))(
          Array.isArray(sort) ? sort : [sort]
        )
      ),
      parse: Array.isArray(parse) ? parse : [parse],
      ...rest
    };
  }
}
