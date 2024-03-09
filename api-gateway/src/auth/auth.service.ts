import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom, lastValueFrom } from 'rxjs';

import { UserMSG } from 'src/common/constanst';
import { ClientProxySuperFlights } from 'src/common/proxy/client-proxy';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly clientProxy: ClientProxySuperFlights,
    private readonly jwtService: JwtService,
  ) {}
  private _clientProxyUser = this.clientProxy.clientProxyUsers();
  async validateUser(username: string, password: string): Promise<any> {
    const user = await lastValueFrom(
      this._clientProxyUser.send(UserMSG.VALID_USER, {
        username,
        password,
      }),
    );

    if (user) return user;
    return null;
  }

  async singIn(user: any) {
    const payload = {
      username: user.username,
      sub: user.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(createUserDto: CreateUserDto) {
    console.log(5);
  
    // return firstValueFrom(
    //   this._clientProxyUser.send(UserMSG.CREATE, createUserDto),
    // );
    return this._clientProxyUser.send(UserMSG.CREATE, createUserDto)
  }
}
