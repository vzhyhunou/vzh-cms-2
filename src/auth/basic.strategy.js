import { BasicStrategy as Strategy } from 'passport-http';
import { PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  Dependencies,
  UnauthorizedException
} from '@nestjs/common';

import { AuthService } from './auth.service';

@Injectable()
@Dependencies(AuthService)
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor(authService) {
    super();
    this.authService = authService;
  }

  async validate(username, password) {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
