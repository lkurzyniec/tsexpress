import { UserResponseDto } from './../dtos/auth/user.response.dto';
import { LoginResult } from './../token/token';
import { TokenService } from './token.service';
import { LoginRequestDto } from '../dtos/auth/login.request.dto';
import { UsersRepository } from './../repositories/users.repository';
import { RegisterRequestDto } from '../dtos/auth/register.request.dto';
import { injectable, inject } from 'inversify';
import { hash, compare } from 'bcrypt';

export enum RegisterResult {
  Success = 'Success',
  EmailTaken = 'Email already taken',
}

@injectable()
export class AuthService {
  @inject(UsersRepository) private repo: UsersRepository;
  @inject(TokenService) private tokenService: TokenService;

  public async register(dto: RegisterRequestDto): Promise<RegisterResult> {
    const isEmailTaken = await this.repo.exists({ email: dto.email });
    if (isEmailTaken) {
      return RegisterResult.EmailTaken;
    }

    const data = dto.toModel();
    data.password = await hash(dto.password, 10);
    await this.repo.create(data);
    return RegisterResult.Success;
  }

  public async login(dto: LoginRequestDto): Promise<LoginResult> {
    const user = await this.repo.findOne({ email: dto.email });
    if (user) {
      const isPasswordMatch = await compare(dto.password, user.password);
      if (isPasswordMatch) {
        const token = this.tokenService.createToken(user);
        const userDto = UserResponseDto.fromModel(user);
        return {
          tokenInfo: token,
          user: userDto,
        }
      }
    }
    return null;
  }
}
