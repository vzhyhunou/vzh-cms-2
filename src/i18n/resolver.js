import { Injectable } from '@nestjs/common';
import { parse } from 'accept-language-parser';

@Injectable()
export class AcceptLanguageResolver {
  resolve(context) {
    const req = context.switchToHttp().getRequest();
    const lang = req.headers['accept-language'];
    return parse(lang)[0]?.code;
  }
}
