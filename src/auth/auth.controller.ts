import { Controller, Get, HttpCode, HttpStatus, Post, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { User } from './decorators/user.decorator';
import { Response } from 'express';
import { RequestUser } from './interfaces/request-user.interface';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  login(
    @User() req,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = this.authService.login(req.user);
    response.cookie('token', token, {
      secure: true,
      httpOnly: true,
      sameSite: true,
    });
  }

  @Get('profile')
  getProfile(@User() { id }: RequestUser) {
    return this.authService.getProfile(id);
  }
}


