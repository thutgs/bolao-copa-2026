import { IsString, IsEmail, MinLength, IsBoolean, IsOptional, IsInt, Matches } from 'class-validator';

export class CreateUsuarioDto {
  @IsString({ message: 'O nome deve ser um texto válido.' })
  nome!: string;

  @IsEmail({}, { message: 'Forneça um endereço de e-mail válido.' })
  email!: string;

  @IsString()
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message: 'A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial (@$!%*?&).',
  })
  senha_hash!: string;

  @IsOptional()
  @IsBoolean()
  is_global_admin?: boolean;

  @IsOptional()
  @IsInt({ message: 'O ID da seleção deve ser um número inteiro.' })
  id_selecao_preferida?: number;

  @IsOptional()
  @IsString({ message: 'O avatar deve ser um texto válido.' })
  avatar?: string;
}