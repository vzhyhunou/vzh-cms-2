import { Dependencies, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

import { ExportService } from './export.service';

@Injectable()
@Dependencies(ConfigService, SchedulerRegistry, ExportService)
export class ExportScheduler {
  constructor(configService, registry, service) {
    this.cron = configService.get('resources.exp.cron');
    this.registry = registry;
    this.service = service;
  }

  onModuleInit() {
    if (this.cron) {
      const job = new CronJob(this.cron, () => this.service.exp());
      this.registry.addCronJob('export', job);
      job.start();
    }
  }
}
