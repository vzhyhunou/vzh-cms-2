import { Injectable, Dependencies } from '@nestjs/common';
import bcrypt from 'bcrypt';

import { SchemasService } from '../schemas/schemas.service';

@Injectable()
@Dependencies(SchemasService)
export class AuthService {
  constructor(schemasService) {
    this.schemasService = schemasService;
  }

  async validateUser(username, password) {
    const {
      schema: {
        contents: {
          authorities: { resource, name }
        }
      }
    } = await this.schemasService.findSettings();
    const user = await this.schemasService.findContent(resource, name, {
      system: { username }
    });
    return (
      user &&
      bcrypt.compareSync(password, user.password) && {
        username,
        authorities: user.authorities
      }
    );
  }
}
