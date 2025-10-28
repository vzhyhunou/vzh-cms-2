import { Injectable } from '@nestjs/common';

@Injectable()
export class MultipartPipe {
  transform({ dto }) {
    return JSON.parse(dto);
  }
}
