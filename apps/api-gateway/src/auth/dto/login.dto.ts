import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'lucas@email.com',
    description: 'Email do usuário',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Senha do usuário',
    writeOnly: true,
  })
  @IsString()
  password: string;
}
