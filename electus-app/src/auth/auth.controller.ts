import { Controller, Post, Body, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @Post('register')
  async register(@Body() body: RegisterDto) {
    const { DeviceName, FullName, Email, Password } = body;
    return this.authService.register(DeviceName, FullName, Email, Password);
  }

  @ApiOperation({ summary: 'Login user' })
  @Post('login')
  async login(@Body() body: LoginDto) {
    const { DeviceName, Email, Password } = body;
    return this.authService.login(DeviceName, Email, Password);
  }

  @ApiOperation({ summary: 'Logout user' })
  @Post('logout')
  async logout(@Headers('authorization') authHeader: string) {
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      return this.authService.logout(token);
    }
    return { message: 'No active session found' };
  }
}
