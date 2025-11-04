import { Catch, NotFoundException } from '@nestjs/common';
import { NotFoundException as Exception } from '@vzhyhunou/vzh-cms-common-2';

@Catch(Exception)
export class HttpExceptionFilter {
  catch(exception, host) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const e = new NotFoundException();

    response.status(e.getStatus()).json(e.getResponse());
  }
}
