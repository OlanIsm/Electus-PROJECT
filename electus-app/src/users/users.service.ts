import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { User } from './user.entity';
import { UserSession } from './user-session.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserSession)
    private sessionsRepository: Repository<UserSession>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  async createSession(user: User, deviceName: string, token: string, expiresAt: Date): Promise<UserSession> {
    const session = this.sessionsRepository.create({
      user,
      deviceName,
      token,
      expiresAt,
    });
    return this.sessionsRepository.save(session);
  }

  async validateSession(userId: string, token: string): Promise<boolean> {
    const count = await this.sessionsRepository.count({
      where: {
        user: { id: userId },
        token,
        expiresAt: MoreThan(new Date()),
      },
    });
    return count > 0;
  }

  async deleteSession(token: string): Promise<void> {
    await this.sessionsRepository.delete({ token });
  }
}
