import { IsString, MinLength } from 'class-validator';

/**
 * @swagger
 *  definitions:
 *    LoginRequestDto:
 *      type: object
 *      required:
 *        - email
 *        - password
 *      properties:
 *        email:
 *          type: string
 *          format: email
 *          description: Email of user, which is also login
 *        password:
 *          type: string
 *          description: Strong password, min 5 chars length
 *      example:
 *         email: test@test.com
 *         password: strongPWD_123
 */
export class LoginRequestDto {
  @IsString()
  @MinLength(3)
  public email: string;

  @IsString()
  @MinLength(5)
  public password: string;
}
