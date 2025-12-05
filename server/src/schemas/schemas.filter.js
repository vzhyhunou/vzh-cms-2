import { Catch, NotFoundException, ConflictException } from '@nestjs/common';
import {
  NotFoundException as ServiceNotFoundException,
  ConflictException as ServiceConflictException
} from '@vzhyhunou/vzh-cms-common-2';

@Catch(ServiceNotFoundException, ServiceConflictException)
export class HttpExceptionFilter {
  catch(exception, host) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const e =
      exception instanceof ServiceNotFoundException
        ? new NotFoundException()
        : new ConflictException();

    response.status(e.getStatus()).json(e.getResponse());
  }
}
