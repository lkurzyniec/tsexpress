import { SecretsProvider } from './../../../../src/services/token/secrets.provider';
import { JwtWrapper } from './../../../../src/wrappers/jwt.wrapper';
import { TokenService } from './../../../../src/services/token/token.service';
import { AppConfig } from './../../../../src/configurations/app.config';
import { TestContext } from './../../test.context';

describe('TokenService', () => {
  const testContext: TestContext = new TestContext();

  describe('create', () => {
    test('create action Should return expected data (token and expiration)', () => {
      //given
      const token = 'TEST TOKEN',
        privateKey = 'TEST KEY';
      const expirationInMin = 1,
        expirationTime = expirationInMin * 60;

      const user = {
        _id: 'SOME TEST ID',
        name: 'John Smith',
        email: 'test@test.pl',
      };

      testContext.mock<AppConfig>(() => ({
        tokenExpirationInMin: expirationInMin,
      }), AppConfig);

      testContext.mock<SecretsProvider>(() => ({
        privateKey: privateKey,
      }), SecretsProvider);

      const jwtWrapperMock = testContext.mock<JwtWrapper>(() => ({
        sign: jest.fn(() => token),
      }), JwtWrapper);

      //when
      var result = testContext.get(TokenService).create(user as any);

      //then
      expect(result.token)
        .toEqual(token);
      expect(result.expiresIn)
        .toEqual(expirationTime);

      expect(jwtWrapperMock.sign)
        .toBeCalledWith(
          expect.objectContaining({
            userId: user._id,
            email: user.email,
            name: user.name,
          }),
          privateKey,
          expect.anything(),
        );
    });
  });

  describe('verify', () => {
    test('When token successfully verified Then should return token data', () => {
      //given
      const token = 'TEST TOKEN',
        publicKey = 'TEST KEY public';
      const userId = 'SOME USER ID';

      testContext.mock<AppConfig>(() => ({
        debug: false,
      }), AppConfig);

      testContext.mock<SecretsProvider>(() => ({
        publicKey: publicKey,
      }), SecretsProvider);

      const jwtWrapperMock = testContext.mock<JwtWrapper>(() => ({
        verify: jest.fn(() => ({ userId })),
      }), JwtWrapper);

      //when
      var result = testContext.get(TokenService).verify(token);

      //then
      expect(result.userId)
        .toEqual(userId);

      expect(jwtWrapperMock.verify)
        .toBeCalledWith(token, publicKey, expect.anything());
    });

    test('When token is wrong Then should return null', () => {
      //given
      testContext.mock<AppConfig>(() => ({
        debug: false,
      }), AppConfig);

      // testContext.mock<SecretsProvider>(() => ({
      //   publicKey: '',
      // }), SecretsProvider);

      const jwtWrapperMock = testContext.mock<JwtWrapper>(() => ({
        verify: jest.fn(() => { throw new Error('some unit test error msg') }),
      }), JwtWrapper);

      //when
      var result = testContext.get(TokenService).verify('any token');

      //then
      expect(result)
        .toBeNull();

      expect(jwtWrapperMock.verify)
        .toBeCalled();
    });
  });
})
