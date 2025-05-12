import { Controller, Dependencies, Get } from '@nestjs/common';

import { ImportService } from './import.service';

@Controller('import')
@Dependencies(ImportService)
export class ImportController {
  constructor(importService) {
    this.importService = importService;
  }

  @Get()
  export() {
    this.importService.imp();
  }
}
