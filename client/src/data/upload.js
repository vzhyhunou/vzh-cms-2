import get from 'lodash/get';
import set from 'lodash/set';
import cloneDeep from 'lodash/cloneDeep';

import dump from './dump';

const PATTERN = '[0-9a-fA-F]{32}.[a-zA-Z0-9]+';
const FIELD_PATTERN = new RegExp(`^${PATTERN}$`);
const MATCH_PATTERN = new RegExp(`"(${PATTERN})"`, 'g');

const createFormData = (dto, files) => {
  const formData = new FormData();
  formData.append('dto', JSON.stringify(dto));
  for (const file of files) {
    formData.append('files', file);
  }
  return formData;
};

export default ({ dataProvider, funcProvider: { originByData } }) => {
  const req = (data) => {
    const { '@files': extra, ...rest } = data;
    const sanitized = cloneDeep(rest);

    dump(sanitized)
      .map((k) => ({ k, v: get(sanitized, k) }))
      .filter(({ v }) => v?.rawFile)
      .forEach(
        ({
          k,
          v: {
            rawFile: { name }
          }
        }) => set(sanitized, k, name)
      );

    dump(sanitized)
      .map((k) => ({ k, v: get(sanitized, k) }))
      .filter(({ v }) => FIELD_PATTERN.test(v?.title))
      .forEach(({ k, v: { title } }) => set(sanitized, k, title));

    const s = JSON.stringify(sanitized);
    const files = dump(data)
      .map((k) => get(data, k))
      .filter((v) => v?.rawFile)
      .map(({ rawFile }) => rawFile)
      .filter(({ name }) => s.includes(name));

    return createFormData(sanitized, files);
  };

  const res = async (data) => {
    const sanitized = cloneDeep(data);

    await Promise.all(
      dump(sanitized)
        .map((k) => ({ k, v: get(sanitized, k) }))
        .filter(({ v }) => typeof v === 'string')
        .filter(({ v }) => FIELD_PATTERN.test(v))
        .map(async ({ k, v }) =>
          set(sanitized, k, {
            src: await originByData(v),
            title: v
          })
        )
    );

    await Promise.all(
      dump(sanitized)
        .map((k) => ({ k, v: get(sanitized, k) }))
        .filter(({ v }) => typeof v === 'string')
        .map(({ k, v }) => ({
          k,
          v: [...new Set([...v.matchAll(MATCH_PATTERN)].map((m) => m[1]))]
        }))
        .filter(({ v }) => v.length)
        .map(async ({ k, v }) =>
          set(
            sanitized,
            `@files.${k}`,
            await Promise.all(
              v.map(async (n) => ({
                src: await originByData(n),
                title: n
              }))
            )
          )
        )
    );

    return sanitized;
  };

  const cnt = async (data) => {
    const sanitized = cloneDeep(data);

    await Promise.all(
      dump(sanitized)
        .map((k) => ({ k, v: get(sanitized, k) }))
        .filter(({ v }) => typeof v === 'string')
        .filter(({ v }) => FIELD_PATTERN.test(v))
        .map(async ({ k, v }) =>
          set(sanitized, k, {
            src: await originByData(v),
            title: v
          })
        )
    );

    await Promise.all(
      dump(sanitized)
        .map((k) => ({ k, v: get(sanitized, k) }))
        .filter(({ v }) => typeof v === 'string')
        .map(({ k, v }) => ({
          k,
          v,
          s: [...new Set([...v.matchAll(MATCH_PATTERN)].map((m) => m[1]))]
        }))
        .filter(({ s }) => s.length)
        .map(async ({ k, v, s }) =>
          set(
            sanitized,
            k,
            await s.reduce(
              async (r, n) => (await r).replaceAll(n, await originByData(n)),
              Promise.resolve(v)
            )
          )
        )
    );

    return sanitized;
  };

  return {
    ...dataProvider,
    create: (resource, { data, ...rest }) =>
      dataProvider.create(resource, { ...rest, data: req(data) }),
    update: (resource, { data, ...rest }) =>
      dataProvider.update(resource, { ...rest, data: req(data) }),
    getOne: (resource, params) =>
      dataProvider.getOne(resource, params).then(async ({ data, ...rest }) => ({
        ...rest,
        data: await res(data)
      })),
    getList: (resource, params) =>
      dataProvider
        .getList(resource, params)
        .then(async ({ data, ...rest }) => ({
          ...rest,
          data: await Promise.all(data.map(res))
        })),
    getMany: (resource, params) =>
      dataProvider
        .getMany(resource, params)
        .then(async ({ data, ...rest }) => ({
          ...rest,
          data: await Promise.all(data.map(res))
        })),
    getContent: (resource, params) =>
      dataProvider
        .getContent(resource, params)
        .then(async ({ data, ...rest }) => ({ ...rest, data: await cnt(data) }))
  };
};
