export class StorageService {
  replaceFilenames(dto, files) {
    return JSON.parse(
      files.reduce(
        (r, { originalname, filename }) => r.replaceAll(originalname, filename),
        dto
      )
    );
  }
}
