import { Dependencies, Injectable } from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { ConfigService } from '@nestjs/config';

@Injectable()
@Dependencies(ConfigService)
export class ServerInterceptor {
  constructor(configService) {
    this.server = `${configService.get('name')}/${configService.get('version')}`;
  }

  intercept(context, next) {
    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse();

    return next.handle().pipe(
      tap(() => {
        response.header('Server', this.server);
      })
    );
  }
}
