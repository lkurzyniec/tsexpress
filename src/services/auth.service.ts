import { User } from './../models/user.model';
import { Mapper } from './../helpers/mapper.helper';
import { UsersRepository } from './../repositories/users.repository';
import { RegisterDto } from './../dtos/register.dto';
import { injectable, inject } from 'inversify';
import { hash } from 'bcrypt';

export enum RegisterResult {
  Success = 'Success',
  EmailTaken = 'Email already taken',
}

@injectable()
export class AuthService {
  @inject(UsersRepository) private repo: UsersRepository;
  @inject(Mapper) protected mapper: Mapper;

  public async register(dto: RegisterDto): Promise<RegisterResult> {
    const isEmailTaken = await this.repo.exists({ email: dto.email });
    if (isEmailTaken) {
      return RegisterResult.EmailTaken;
    }

    const hashedPassword = await hash(dto.password, 10);
    const data = this.mapper.map(dto, User, (s, d) => {
      d.password = hashedPassword;
    });
    await this.repo.create(data);
    return RegisterResult.Success;
  }
}
