import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  readonly name: string;
  readonly username: string;
  readonly email: string;
   password: string;
}
