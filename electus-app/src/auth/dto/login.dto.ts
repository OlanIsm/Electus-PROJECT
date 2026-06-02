import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'My Device' })
  DeviceName: string;

  @ApiProperty({ example: 'john@example.com' })
  Email: string;

  @ApiProperty({ example: 'password123' })
  Password: string;
}
