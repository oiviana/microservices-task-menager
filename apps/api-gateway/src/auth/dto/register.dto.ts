import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'Lucas Viana',
    description: 'Nome completo do usuário',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'lucas@email.com',
    description: 'Email do usuário',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Senha do usuário (mínimo 6 caracteres)',
    minLength: 6,
  })
  @MinLength(6)
  password: string;
}
