import { TokenData } from '../services/token/token';
import { Request } from 'express';

export interface AuthRequest extends Request {
  auth: TokenData;
}

