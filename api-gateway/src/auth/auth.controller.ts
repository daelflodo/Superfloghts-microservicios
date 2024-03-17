import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';


@ApiTags('Autentication')
@Controller('/api/v1/auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ){}
    @UseGuards(LocalAuthGuard)
    @Post('sign-in')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                username: {
                    type: 'string',
                    description: 'The username of the user',
                    example: 'usuario',
                },
                password: {
                    type: 'string',
                    description: 'The password of the user',
                    example: 'password123',
                },
            },
        },
        description: 'Credentials for user authentication',
    })
    async signIn(@Req() req){
        return await this.authService.singIn(req.user)
    }
    @Post('sign-up')
    async signUp(@Body() createUserDto : CreateUserDto){
        return await this.authService.signUp(createUserDto)
    }
}
