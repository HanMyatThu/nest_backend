import { IsEmail, IsPhoneNumber, Length } from "class-validator";
import { IsPassword } from "common/decorators/validators/is-password.decorator";

export class CreateUserDto {
  @Length(2, 50)
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsPhoneNumber('TH')
  readonly phone: string;

  /**
   * Checks if the value is a string following these rules:
   * 1. 8 to 20 characters
   * 2. At least one
   * - Lowercase letter
   * - Uppercase letter
   * - Number
   * - Special character
   */
  @IsPassword()
  readonly password: string;
}
