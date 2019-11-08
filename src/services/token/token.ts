import { UserResponseDto } from '../../dtos/auth/user.response.dto';

export interface TokenInfo {
  token: string;
  expiresIn: number;
}

export interface TokenData {
  userId: string;
  name: string;
  email: string;
}

export interface LoginResult {
  tokenInfo: TokenInfo;
  user: UserResponseDto
}
