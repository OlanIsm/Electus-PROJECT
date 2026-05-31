import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'electus-super-secret-key-change-in-prod'),
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: any) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : '';
    const isValid = await this.usersService.validateSession(payload.sub, token);
    if (!isValid) {
      throw new UnauthorizedException('Session expired or logged out');
    }
    return { userId: payload.sub, email: payload.email, fullName: payload.fullName };
  }
}
