import { Injectable } from '@nestjs/common';

@Injectable()
export class PageablePipe {
  transform({ page = 0, size = 20, sort = [], ...rest }) {
    return {
      page,
      size,
      sort: Object.fromEntries(
        ((sort) => sort.map((s) => s.split(',')))(
          Array.isArray(sort) ? sort : [sort]
        )
      ),
      ...rest
    };
  }
}
