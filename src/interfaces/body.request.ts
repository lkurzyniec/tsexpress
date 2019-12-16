import { AuthRequest } from './auth.request';

export interface BodyRequest<T> extends AuthRequest {
  body: T;
}
