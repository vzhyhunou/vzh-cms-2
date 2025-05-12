import { Dependencies, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ImportService } from './import.service';

@Injectable()
@Dependencies(ConfigService, ImportService)
export class ImportInitializer {
  constructor(configService, importService) {
    if (configService.get('resources.imp.init')) {
      this.importService = importService;
    }
  }

  async onModuleInit() {
    await this.importService?.imp();
  }
}
