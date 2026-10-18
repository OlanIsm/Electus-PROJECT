import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  RECRUITER = 'recruiter',
  INTERVIEWER = 'interviewer',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password?: string;

  @Column()
  fullName: string;

  @Column({ nullable: true })
  avatarUrl?: string;

  @Column({ nullable: true })
  companyId?: string;

  @Column({ default: UserRole.ADMIN })
  role: string;

  @Column({ type: 'simple-json', nullable: true })
  riasecTarget?: Record<string, number>;

  @CreateDateColumn()
  createdAt: Date;
}
