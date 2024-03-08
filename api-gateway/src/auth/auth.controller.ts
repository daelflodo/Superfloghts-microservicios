import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Autentication')
@Controller('/api/v2/auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ){}
    @UseGuards(LocalAuthGuard)
    @Post('sign-in')
    async signIn(@Req() req){
        console.log(req.user);
        return await this.authService.singIn(req.user)
    }
    @Post('sign-up')
    async signUp(@Body() createUserDto : CreateUserDto){
        return await this.authService.singUp(createUserDto)
    }
}
