import { Injectable, Dependencies } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

import { SchemasService } from '../schemas/schemas.service';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
@Dependencies(Reflector, SchemasService)
export class JwtGuard extends AuthGuard('jwt') {
  constructor(reflector, schemasService) {
    super();
    this.reflector = reflector;
    this.schemasService = schemasService;
  }

  async onModuleInit() {
    const editors = await this.schemasService.findEditors();
    this.isUserInRole = ({ user: { authorities }, params: { resource } }) =>
      authorities.includes(editors[resource]);
  }

  async canActivate(context) {
    const request = context.switchToHttp().getRequest();
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (isPublic) {
      try {
        await super.canActivate(context);
        request.user.authorized = this.isUserInRole(request);
      } catch (e) {}
      return true;
    }

    try {
      await super.canActivate(context);
      return this.isUserInRole(request);
    } catch (e) {
      if (process.env.NODE_ENV === 'development') {
        return true;
      }
      throw e;
    }
  }
}
