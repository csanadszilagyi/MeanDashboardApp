import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { CookieTokenStorage } from '../token/cookie-token-storage';
import { AuthJWTCookieToken } from './auth-token';

@Injectable()
export class CookieTokenService {

    constructor(protected tokenStorage: CookieTokenStorage) {}

    get(): Observable<AuthJWTCookieToken> {
        const token = this.tokenStorage.get();
        if (token) {
            return of(token);
        }
        return throwError('Payload cookie is not provided.');
    }
}