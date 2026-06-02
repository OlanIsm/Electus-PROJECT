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

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  async updateProfile(id: string, updateData: Partial<User>): Promise<User | null> {
    await this.usersRepository.update(id, updateData);
    return this.findById(id);
  }

  async updateCultureFit(id: string, riasecTarget: Record<string, number>): Promise<User | null> {
    await this.usersRepository.update(id, { riasecTarget });
    return this.findById(id);
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
