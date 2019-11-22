import { RegisterRequestDto } from './../../../src/dtos/auth/register.request.dto';
import { TestContainer } from './../test-container';
import { UsersRepository } from './../../../src/repositories/users.repository';
import { AuthService } from './../../../src/services/auth.service';

describe('AuthService', () => {
  let service: AuthService;
  const container = new TestContainer();

  describe('register', () => {
    const test1: jest.Mocked<UsersRepository> = {

    } as any;

    const mockUsersRepository = jest.fn<UsersRepository, []>(() => ({
      mongooseModel: jest.fn(),
      findById: jest.fn(),
      findOne: jest.fn(),
      findMany: jest.fn(),
      exists: jest.fn(),
      getAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    }));

    beforeEach(() => {
      container.rebind<UsersRepository>(UsersRepository).toConstantValue(mockUsersRepository);
      service = container.get(AuthService);
    });

    test('When email already exists Then return EmailTaken and do not proceed', async () => {
      //given
      mockUsersRepository.exists.mockReturnValue(Promise.resolve(true));

      const registerDto = {
        email: 'test@test.com',
      } as RegisterRequestDto;

      //when
      var result = await service.register(registerDto);

      //then
      expect(result).toBe('Email already taken');
    })
  });
})
