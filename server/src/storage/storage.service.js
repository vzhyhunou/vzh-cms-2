import { Injectable, Dependencies } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import { StorageService as BaseStorageService } from '@vzhyhunou/vzh-cms-common-2';

const MATCH_PATTERN = /\\?"([0-9a-fA-F]{32}.[a-zA-Z0-9]+)\\?"/g;

@Injectable()
@Dependencies(ConfigService)
export class StorageService extends BaseStorageService {
  constructor(configService) {
    super();
    this.path = configService.get('locations.origin');
  }

  getFilenames(dto) {
    return [...JSON.stringify(dto).matchAll(MATCH_PATTERN)].map((m) =>
      path.join(this.path, m[1])
    );
  }
}
