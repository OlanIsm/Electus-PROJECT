import { Controller, Post, Body, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: any) {
    const { DeviceName, FullName, Email, Password } = body;
    return this.authService.register(DeviceName, FullName, Email, Password);
  }

  @Post('login')
  async login(@Body() body: any) {
    const { DeviceName, Email, Password } = body;
    return this.authService.login(DeviceName, Email, Password);
  }

  @Post('logout')
  async logout(@Headers('authorization') authHeader: string) {
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      return this.authService.logout(token);
    }
    return { message: 'No active session found' };
  }
}
