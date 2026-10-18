import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class InviteCandidateDto {
  @ApiProperty({ example: 'Senior Software Engineer' })
  @IsString()
  @IsNotEmpty()
  jobTitle: string;

  @ApiProperty({ example: '2026-10-25 10:00 AM' })
  @IsString()
  @IsNotEmpty()
  interviewDate: string;

  @ApiProperty({ example: 'Jane HR' })
  @IsString()
  @IsNotEmpty()
  hrName: string;

  @ApiProperty({ example: 'Looking forward to meeting you!', required: false })
  @IsString()
  @IsOptional()
  customMessage?: string;
}
