import { Controller, Dependencies, Get } from '@nestjs/common';

import { ExportService } from './export.service';

@Controller('export')
@Dependencies(ExportService)
export class ExportController {
  constructor(exportService) {
    this.exportService = exportService;
  }

  @Get()
  exp() {
    this.exportService.exp();
  }
}
