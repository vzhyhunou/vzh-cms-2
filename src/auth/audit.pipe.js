import { Injectable, Dependencies, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
@Dependencies(REQUEST)
export class AuditPipe {
  constructor(request) {
    this.request = request;
  }

  async transform(dto) {
    return {
      ...dto,
      date: new Date(),
      userId: this.request.user?.username
    };
  }
}
