import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidatesModule } from './candidates/candidates.module';
import { Candidate } from './candidates/candidate.entity';

@Module({
  imports: [
      TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'olannurillA1',
      database: 'electus',
      entities: [Candidate],
      synchronize: true,
      }),
    CandidatesModule,
  ],
})
export class AppModule {}