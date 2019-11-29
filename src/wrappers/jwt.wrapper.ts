import { injectable } from 'inversify';
import * as jwt from 'jsonwebtoken';

@injectable()
export class JwtWrapper {
  public sign(
    payload: string | Buffer | object,
    secretOrPrivateKey: Secret,
    options?: SignOptions,
  ): string {
    return jwt.sign(payload, secretOrPrivateKey, options);
  }

  public verify(
    token: string,
    secretOrPublicKey: Secret,
    options?: VerifyOptions
  ): object | string {
    return jwt.verify(token, secretOrPublicKey, options);
  }
}

export type Secret =
  | string
  | Buffer
  | { key: string | Buffer; passphrase: string };

export interface SignOptions {
  /**
   * Signature algorithm. Could be one of these values :
   * - HS256:    HMAC using SHA-256 hash algorithm (default)
   * - HS384:    HMAC using SHA-384 hash algorithm
   * - HS512:    HMAC using SHA-512 hash algorithm
   * - RS256:    RSASSA using SHA-256 hash algorithm
   * - RS384:    RSASSA using SHA-384 hash algorithm
   * - RS512:    RSASSA using SHA-512 hash algorithm
   * - ES256:    ECDSA using P-256 curve and SHA-256 hash algorithm
   * - ES384:    ECDSA using P-384 curve and SHA-384 hash algorithm
   * - ES512:    ECDSA using P-521 curve and SHA-512 hash algorithm
   * - none:     No digital signature or MAC value included
   */
  algorithm?: string;
  keyid?: string;
  /** expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms.js).  Eg: 60, "2 days", "10h", "7d" */
  expiresIn?: string | number;
  /** expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms.js).  Eg: 60, "2 days", "10h", "7d" */
  notBefore?: string | number;
  audience?: string | string[];
  subject?: string;
  issuer?: string;
  jwtid?: string;
  mutatePayload?: boolean;
  noTimestamp?: boolean;
  header?: object;
  encoding?: string;
};

export interface VerifyOptions {
  algorithms?: string[];
  audience?: string | RegExp | Array<string | RegExp>;
  clockTimestamp?: number;
  clockTolerance?: number;
  complete?: boolean;
  issuer?: string | string[];
  ignoreExpiration?: boolean;
  ignoreNotBefore?: boolean;
  jwtid?: string;
  nonce?: string;
  subject?: string;
  /**
   * @deprecated
   * Max age of token
   */
  maxAge?: string;
}
