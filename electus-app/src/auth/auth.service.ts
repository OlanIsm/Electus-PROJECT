import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(deviceName: string, fullName: string, email: string, passwordHash: string) {
    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(passwordHash, 10);
    const user = await this.usersService.create({
      fullName,
      email,
      password: hashedPassword,
    });

    const payload = { sub: user.id, email: user.email, fullName: user.fullName };
    const token = this.jwtService.sign(payload);

    // Save session in database with 2 weeks expiry (14 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 14);

    await this.usersService.createSession(user, deviceName || 'Unknown Device', token, expiresAt);

    return {
      message: 'Registration successful',
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    };
  }

  async login(deviceName: string, email: string, passwordHash: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(passwordHash, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, fullName: user.fullName };
    const token = this.jwtService.sign(payload);

    // Save session in database with 2 weeks expiry (14 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 14);

    await this.usersService.createSession(user, deviceName || 'Unknown Device', token, expiresAt);

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    };
  }

  async logout(token: string) {
    await this.usersService.deleteSession(token);
    return { message: 'Logged out successfully' };
  }
}
