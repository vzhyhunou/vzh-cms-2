import {
  Controller,
  Dependencies,
  Bind,
  Request,
  Get,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

import { Public } from './public.decorator';

@Controller('auth')
@Dependencies(JwtService)
export class AuthController {
  constructor(jwtService) {
    this.jwtService = jwtService;
  }

  @UseGuards(AuthGuard('basic'))
  @Get()
  @Bind(Request())
  @Public()
  auth({ user: { username, authorities } }) {
    return this.jwtService.sign({ sub: username, roles: authorities });
  }
}
