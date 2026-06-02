import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CandidatesService } from './candidates/candidates.service';
import { Candidate } from './candidates/candidate.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const candidatesService = app.get(CandidatesService);

  const mockCandidates: Partial<Candidate>[] = [
    {
      fullName: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      phone: '+1234567890',
      reviewStatus: 'pending',
      processingStatus: 'done',
      aiSummary: ['Strong problem solver', '5+ years Node.js', 'Great communication'],
      cvText: 'Experienced backend developer...',
      skills: ['Node.js', 'NestJS', 'PostgreSQL', 'TypeScript'],
      hollandCode: {
        primary: 'Investigative',
        label: 'Thinker',
        distribution: [
          { code: 'I', label: 'Investigative', value: 80, color: 'blue' },
          { code: 'R', label: 'Realistic', value: 60, color: 'green' },
          { code: 'A', label: 'Artistic', value: 50, color: 'purple' },
          { code: 'S', label: 'Social', value: 40, color: 'yellow' },
          { code: 'E', label: 'Enterprising', value: 70, color: 'orange' },
          { code: 'C', label: 'Conventional', value: 30, color: 'gray' },
        ],
      },
      education: 'B.Sc. in Computer Science',
      experience: '5 years at TechCorp',
      hasPortfolio: true,
      portfolioUrl: 'https://alice.dev',
      matchScore: 92,
    },
    {
      fullName: 'Bob Smith',
      email: 'bob.smith@example.com',
      phone: '+0987654321',
      reviewStatus: 'reviewed',
      processingStatus: 'done',
      aiSummary: ['Excellent UI/UX skills', '3 years React', 'Creative'],
      cvText: 'Frontend developer with a passion for design...',
      skills: ['React', 'CSS', 'Figma', 'JavaScript'],
      hollandCode: {
        primary: 'Artistic',
        label: 'Creator',
        distribution: [
          { code: 'I', label: 'Investigative', value: 40, color: 'blue' },
          { code: 'R', label: 'Realistic', value: 30, color: 'green' },
          { code: 'A', label: 'Artistic', value: 85, color: 'purple' },
          { code: 'S', label: 'Social', value: 65, color: 'yellow' },
          { code: 'E', label: 'Enterprising', value: 50, color: 'orange' },
          { code: 'C', label: 'Conventional', value: 20, color: 'gray' },
        ],
      },
      education: 'B.A. in Graphic Design',
      experience: '3 years at DesignStudio',
      hasPortfolio: true,
      portfolioUrl: 'https://bob.design',
      matchScore: 78,
    },
    {
      fullName: 'Charlie Davis',
      email: 'charlie.davis@example.com',
      phone: '+1122334455',
      reviewStatus: 'interviewed',
      processingStatus: 'done',
      aiSummary: ['Leadership experience', 'Agile methodologies', 'Scrum Master'],
      cvText: 'Project manager specialized in software delivery...',
      skills: ['Agile', 'Scrum', 'Jira', 'Leadership'],
      hollandCode: {
        primary: 'Enterprising',
        label: 'Persuader',
        distribution: [
          { code: 'I', label: 'Investigative', value: 50, color: 'blue' },
          { code: 'R', label: 'Realistic', value: 40, color: 'green' },
          { code: 'A', label: 'Artistic', value: 30, color: 'purple' },
          { code: 'S', label: 'Social', value: 75, color: 'yellow' },
          { code: 'E', label: 'Enterprising', value: 90, color: 'orange' },
          { code: 'C', label: 'Conventional', value: 60, color: 'gray' },
        ],
      },
      education: 'MBA',
      experience: '7 years managing teams',
      hasPortfolio: false,
      portfolioUrl: '',
      matchScore: 85,
    },
    {
      fullName: 'Diana Prince',
      email: 'diana.prince@example.com',
      phone: '+9988776655',
      reviewStatus: 'pending',
      processingStatus: 'done',
      aiSummary: ['Data engineering', 'Python expert', 'Big Data pipelines'],
      cvText: 'Data Engineer with experience in ETL processes...',
      skills: ['Python', 'SQL', 'Spark', 'AWS'],
      hollandCode: {
        primary: 'Investigative',
        label: 'Thinker',
        distribution: [
          { code: 'I', label: 'Investigative', value: 90, color: 'blue' },
          { code: 'R', label: 'Realistic', value: 70, color: 'green' },
          { code: 'A', label: 'Artistic', value: 20, color: 'purple' },
          { code: 'S', label: 'Social', value: 30, color: 'yellow' },
          { code: 'E', label: 'Enterprising', value: 60, color: 'orange' },
          { code: 'C', label: 'Conventional', value: 80, color: 'gray' },
        ],
      },
      education: 'M.Sc. in Data Science',
      experience: '4 years at DataWorks',
      hasPortfolio: true,
      portfolioUrl: 'https://diana.data',
      matchScore: 95,
    }
  ];

  for (const candidateData of mockCandidates) {
    await candidatesService.create(candidateData);
    console.log(`Injected candidate: ${candidateData.fullName}`);
  }

  console.log('Finished injecting candidates!');
  await app.close();
}

bootstrap();
