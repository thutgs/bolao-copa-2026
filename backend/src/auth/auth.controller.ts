import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK) // Login retorna 200 OK, e não 201 Created
  @Post('login')
  login(@Body() loginDto: Record<string, any>) {
    // O front-end deve enviar um JSON com { "email": "...", "senha": "..." }
    return this.authService.login(loginDto.email, loginDto.senha);
  }
}