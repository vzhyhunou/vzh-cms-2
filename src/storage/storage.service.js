import { Injectable } from '@nestjs/common';

@Injectable()
export class StorageService {
  replaceFilenames(dto, files) {
    let s = JSON.stringify(dto);
    for (const { originalname, filename } of files) {
      s = s.replaceAll(originalname, filename);
    }
    return JSON.parse(s);
  }
}
