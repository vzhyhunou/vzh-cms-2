import '../common/repository/base.repository';

export default {
  findByContent(resource, name) {
    return this.findOne({
      select: {
        id: true
      },
      relations: {
        contents: true
      },
      where: { id: resource, contents: { name } }
    });
  },
  findByComponent(resource, name) {
    return this.findOne({
      select: {
        id: true
      },
      relations: {
        components: true
      },
      where: { id: resource, components: { name } }
    });
  }
};
