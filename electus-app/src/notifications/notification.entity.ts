import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // For simplicity, we just store userId instead of a full relation
  // or we can map it to User entity if we need relations. Let's use string for now.
  @Column()
  userId: string;

  @Column()
  type: string;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({ default: false })
  isRead: boolean;

  @Column({ nullable: true })
  badgeLabel?: string;

  @CreateDateColumn()
  createdAt: Date;
}
