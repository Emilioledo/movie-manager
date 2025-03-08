import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('register')
  async signUp(@Body(ValidationPipe) authDto: AuthDto) {
    return this.authService.signUp(authDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body(ValidationPipe) authDto: AuthDto) {
    return this.authService.signIn(authDto);
  }
}
