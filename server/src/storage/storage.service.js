import { Injectable, Dependencies } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import path from 'path';

const MATCH_PATTERN = /\\?"([0-9a-fA-F]{32}.[a-zA-Z0-9]+)\\?"/g;

@Injectable()
@Dependencies(ConfigService)
export class StorageService {
  constructor(configService) {
    this.path = configService.get('locations.origin');
  }

  replaceFilenames(dto, files) {
    return JSON.parse(
      files.reduce(
        (r, { originalname, filename }) => r.replaceAll(originalname, filename),
        dto
      )
    );
  }

  getFilenames(dto) {
    return [...JSON.stringify(dto).matchAll(MATCH_PATTERN)].map((m) =>
      path.join(this.path, m[1])
    );
  }
}
