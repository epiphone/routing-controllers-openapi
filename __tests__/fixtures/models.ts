import { IsInt, IsOptional, IsEmail, IsString } from 'class-validator'

export class ModelDto {
  @IsEmail()
  email: string
  @IsString()
  username: string
  @IsOptional()
  @IsInt()
  age: number
}
