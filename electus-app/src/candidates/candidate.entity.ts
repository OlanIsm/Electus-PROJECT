import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

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

  // AI-generated 3-point summary stored as JSON array
  @Column({ type: 'simple-json', nullable: true })
  aiSummary: string[];

  // Raw CV text for AI processing
  @Column({ type: 'text', nullable: true })
  cvText: string;

  // Skills extracted from CV
  @Column({ type: 'simple-json', nullable: true })
  skills: string[];

  // Holland Code RIASEC personality assessment
  @Column({ type: 'simple-json', nullable: true })
  hollandCode: {
    primary: string;
    label: string;
    distribution: {
      code: string;
      label: string;
      value: number;
      color: string;
    }[];
  };

  @Column({ nullable: true })
  education: string;

  @Column({ nullable: true })
  experience: string;

  @Column({ nullable: true })
  portfolioUrl: string;

  @Column({ default: false })
  hasPortfolio: boolean;

  @Column({ type: 'float', nullable: true })
  matchScore: number;

  // Path to uploaded CV file
  @Column({ nullable: true })
  cvFilePath: string;

  // Vector embedding for semantic search (stored as JSON float array)
  @Column({ type: 'simple-json', nullable: true })
  embedding: number[];

  @CreateDateColumn()
  createdAt: Date;
}