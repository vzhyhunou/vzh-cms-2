import { Repository } from 'typeorm';

import '../common/repository/base.repository';

export default (service) => ({
  async save(dto) {
    const result = await Repository.prototype.save.call(this, dto);
    await service.save(dto);
    return result;
  },
  async remove(dto) {
    const result = await Repository.prototype.remove.call(this, dto);
    await service.remove(dto);
    return result;
  }
});
