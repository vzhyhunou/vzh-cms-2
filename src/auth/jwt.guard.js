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

  async isUserInRole({ user: { authorities }, params: { resource } }) {
    const editors = await this.schemasService.findEditors();
    return authorities.includes(editors[resource]);
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
        request.user.authorized = await this.isUserInRole(request);
      } catch (e) {
        // eslint-disable-line no-empty
      }
      return true;
    }

    try {
      await super.canActivate(context);
      return await this.isUserInRole(request);
    } catch (e) {
      if (process.env.NODE_ENV === 'development') {
        return true;
      }
      throw e;
    }
  }
}
