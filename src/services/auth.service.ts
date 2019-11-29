import { BcryptWrapper } from './../wrappers/bcrypt.wrapper';
import { User } from './../models/user.model';
import { UserResponseDto } from './../dtos/auth/user.response.dto';
import { LoginResult } from './token/token';
import { TokenService } from './token/token.service';
import { LoginRequestDto } from '../dtos/auth/login.request.dto';
import { UsersRepository } from './../repositories/users.repository';
import { RegisterRequestDto } from '../dtos/auth/register.request.dto';
import { injectable, inject } from 'inversify';

export enum RegisterResult {
  Success = 'Success',
  EmailTaken = 'Email already taken',
}

@injectable()
export class AuthService {
  private readonly salt = 10;

  @inject(UsersRepository) private repo: UsersRepository;
  @inject(TokenService) private tokenService: TokenService;
  @inject(BcryptWrapper) private bcrypt: BcryptWrapper;

  public async register(dto: RegisterRequestDto): Promise<RegisterResult> {
    const isEmailTaken = await this.repo.exists({ email: dto.email });
    if (isEmailTaken) {
      return RegisterResult.EmailTaken;
    }

    const data = this.dtoToModel(dto);
    data.password = await this.bcrypt.hash(dto.password, this.salt);
    await this.repo.create(data);
    return RegisterResult.Success;
  }

  public async login(dto: LoginRequestDto): Promise<LoginResult> {
    const user = await this.repo.findOne({ email: dto.email });
    if (user) {
      const isPasswordMatch = await this.bcrypt.compare(dto.password, user.password);
      if (isPasswordMatch) {
        const token = this.tokenService.create(user);
        const userDto = this.modelToDto(user);
        return {
          tokenInfo: token,
          user: userDto,
        }
      }
    }
    return null;
  }

  private modelToDto(model: User): UserResponseDto {
    return new UserResponseDto({
      name: model.name,
      email: model.email,
    });
  }

  private dtoToModel(dto: RegisterRequestDto): User {
    return new User({
      name: dto.name,
      email: dto.email,
    });
  };
}
