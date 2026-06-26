import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'My Device' })
  DeviceName: string;

  @ApiProperty({ example: 'John Doe' })
  FullName: string;

  @ApiProperty({ example: 'john@example.com' })
  Email: string;

  @ApiProperty({ example: 'password123' })
  Password: string;
}
