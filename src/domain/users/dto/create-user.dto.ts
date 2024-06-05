import { IsEmail, IsPhoneNumber, IsString, Length } from "class-validator";

export class CreateUserDto {
  @Length(2, 50)
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsPhoneNumber('TH')
  readonly phone: string;

  @IsString()
  readonly password: string;
}
