import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Candidate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ default: 'pending' })
  reviewStatus: string;

  @Column({ type: 'text', nullable: true })
  summary: string;

  @CreateDateColumn()
  createdAt: Date;
}