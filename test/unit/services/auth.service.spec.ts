import { TokenService } from './../../../src/services/token/token.service';
import { BcryptWrapper } from './../../../src/wrappers/bcrypt.wrapper';
import { TestContext } from './../test.context';
import { LoginRequestDto } from './../../../src/dtos/auth/login.request.dto';
import { RegisterRequestDto } from './../../../src/dtos/auth/register.request.dto';
import { UsersRepository } from './../../../src/repositories/users.repository';
import { AuthService, RegisterResult } from './../../../src/services/auth.service';
import { TokenInfo } from './../../../src/services/token/token';

describe('AuthService', () => {
  const testContext: TestContext = new TestContext();

  describe('register', () => {
    test('When email already exists Then return EmailTaken and do not proceed', async () => {
      //given
      const email = 'test@test.com';

      const usersRepositoryMock = testContext.mock<UsersRepository>(() => ({
        exists: jest.fn(() => Promise.resolve(true)),
        create: jest.fn(),
      }), UsersRepository);

      //when
      var result = await testContext.get(AuthService).register({
        email
      } as RegisterRequestDto);

      //then
      expect(result)
        .toBe(RegisterResult.EmailTaken);

      expect(usersRepositoryMock.exists)
        .toBeCalledWith(
          expect.objectContaining({
            email
          })
        );

      expect(usersRepositoryMock.create)
        .toBeCalledTimes(0);
    });

    test('When email not exists Then should create user and return success', async () => {
      //given
      const password = 'TEST_PASSWORD',
        hashedPassword = 'HASHED_PWD',
        name = 'UNIT_TEST',
        email = 'test@test.com';

      const usersRepositoryMock = testContext.mock<UsersRepository>(() => ({
        exists: jest.fn(() => Promise.resolve(false)),
        create: jest.fn(),
      }), UsersRepository);

      const bcryptMock = testContext.mock<BcryptWrapper>(() => ({
        hash: jest.fn(() => Promise.resolve(hashedPassword)),
      }), BcryptWrapper);

      //when
      var result = await testContext.get(AuthService).register({
        name,
        email,
        password,
      });

      //then
      expect(result)
        .toBe(RegisterResult.Success);

      expect(usersRepositoryMock.exists)
        .toBeCalledTimes(1);

      expect(bcryptMock.hash)
        .toBeCalledWith(password, expect.any(Number));

      expect(usersRepositoryMock.create)
        .toBeCalledWith(expect.objectContaining({
          password: hashedPassword,
          name,
          email,
        }));
    });
  });

  describe('login', () => {
    test('When user not found in DB Then return null and do not proceed', async () => {
      //given
      const email = 'test@test.com';

      const usersRepositoryMock = testContext.mock<UsersRepository>(() => ({
        findOne: jest.fn(() => Promise.resolve(null)),
      }), UsersRepository);

      const bcryptMock = testContext.mock<BcryptWrapper>(() => ({
        compare: jest.fn(),
      }), BcryptWrapper);

      //when
      var result = await testContext.get(AuthService).login({
        email
      } as LoginRequestDto);

      //then
      expect(result).toBe(null);

      expect(usersRepositoryMock.findOne)
        .toBeCalledWith(expect.objectContaining({
          email,
        }));

      expect(bcryptMock.compare)
        .not.toBeCalled();
    });

    test('When passwords do not match Then return null and do not proceed', async () => {
      //given
      const password = 'TEST PWD',
        userPassword = 'TEST USER PWD';

      const usersRepositoryMock = testContext.mock<UsersRepository>(() => ({
        findOne: jest.fn(() => Promise.resolve({
          password: userPassword
        } as any)),
      }), UsersRepository);

      const bcryptMock = testContext.mock<BcryptWrapper>(() => ({
        compare: jest.fn(() => Promise.resolve(false)),
      }), BcryptWrapper);

      const tokenServiceMock = testContext.mock<TokenService>(() => ({
        create: jest.fn(),
      }), TokenService);

      //when
      var result = await testContext.get(AuthService).login({
        password
      } as LoginRequestDto);

      //then
      expect(result).toBe(null);

      expect(usersRepositoryMock.findOne)
        .toBeCalled();

      expect(bcryptMock.compare)
        .toBeCalledWith(password, userPassword);

      expect(tokenServiceMock.create)
        .not.toBeCalled();
    });

    test('When passwords match Then should create token and return user with it', async () => {
      //given
      const user = {
        name: 'TEST',
        email: 'test@test.com',
      };

      const tokenInfo = {
        token: 'TEST token',
      } as TokenInfo;

      const usersRepositoryMock = testContext.mock<UsersRepository>(() => ({
        findOne: jest.fn(() => Promise.resolve(user as any)),
      }), UsersRepository);

      const bcryptMock = testContext.mock<BcryptWrapper>(() => ({
        compare: jest.fn(() => Promise.resolve(true)),
      }), BcryptWrapper);

      const tokenServiceMock = testContext.mock<TokenService>(() => ({
        create: jest.fn(() => tokenInfo),
      }), TokenService);

      //when
      var result = await testContext.get(AuthService).login({} as LoginRequestDto);

      //then
      expect(result.tokenInfo).toBe(tokenInfo);
      expect(result.user).toEqual(user);

      expect(usersRepositoryMock.findOne)
        .toBeCalled();

      expect(bcryptMock.compare)
        .toBeCalled();

      expect(tokenServiceMock.create)
        .toBeCalledWith(user);
    });
  });
})
