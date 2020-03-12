import { Injectable } from '@angular/core';
import { AuthJWTCookieToken } from './auth-token';
import { has as _has } from 'lodash';
import { Observable } from 'rxjs';

@Injectable()
export class CookieTokenStorage {

  protected key = 't_hp';

  constructor() {}

  get(): Observable<AuthJWTCookieToken> {

    return Observable.create((observer) => {

      const allCookies = document.cookie;

      // console.log(allCookies);
  
      let list = {};
  
      allCookies && allCookies.split(';').forEach( cookie => {
        let parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
      });
  
      let payload = '';
      if (_has(list, this.key)) {
        payload = list[this.key];
        observer.next(new AuthJWTCookieToken(payload));
        observer.complete();
        /*
        const splitted = list[this.key].split('.');
        payload = splitted.length >= 2 ? splitted[1] : '';
        */
      }
      else {
        observer.error('No payload cookie has found');
      }
      
    });


    
    // return new AuthJWTCookieToken(payload);
  }

  set(token: AuthJWTCookieToken) {}

  clear() {
    // document.cookie = '';
  }
}