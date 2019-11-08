import { TokenData } from './../services/token/token';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  auth: TokenData;
}
