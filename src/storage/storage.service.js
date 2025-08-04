import { Injectable } from '@nestjs/common';

@Injectable()
export class StorageService {
  replaceFilenames(dto, files) {
    return JSON.parse(
      files.reduce(
        (r, { originalname, filename }) => r.replaceAll(originalname, filename),
        JSON.stringify(dto)
      )
    );
  }
}
