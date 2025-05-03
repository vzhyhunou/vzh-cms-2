import { Like } from 'typeorm';

import '../common/repository/base.repository';

export default {
  async list(id, page, size, order) {
    return Promise.all([
      this.find({
        select: { id: true },
        where: id ? { id: Like(`%${id}%`) } : {},
        skip: page * size,
        take: size,
        order
      }),
      this.count({
        where: id ? { id: Like(`%${id}%`) } : {}
      })
    ]).then(([content, totalElements]) => ({
      content,
      totalElements
    }));
  }
};
