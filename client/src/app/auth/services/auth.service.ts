import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginData, SessionState, SubmitResult } from 'src/app/misc/utils';
import { AppConfigService } from 'src/app/core/services/app-config.service';
import { UserSessionService } from 'src/app/core/services/user-session.service';
import { CookieTokenStorage } from '../token/cookie-token-storage';

@Injectable()
export class AuthService {

  protected authUrl: String;
  protected headers: HttpHeaders = new HttpHeaders();

  constructor(protected http: HttpClient,
              protected router: Router,
              protected userSession: UserSessionService,
              protected cookieTokenStorage: CookieTokenStorage) { 
    
    // getting api url from config service
    this.authUrl = AppConfigService.settings.apiUrl + '/auth';

    this.headers = this.headers.set('Content-Type', 'application/json');
  }


  dataToApiSchema(data: any): any {
    return {
        data
    }
  };

  login(loginData: LoginData): Promise<SubmitResult> {
    return new Promise<SubmitResult>((resolve, reject) => {
      this.http
        .post<any>(
          `${this.authUrl}/login`, 
          this.dataToApiSchema(loginData),
          {
            observe: 'response',
            headers: this.headers
          }
        )
        .pipe(
          catchError(this.handleResponseError)
        )
        .subscribe(
          (response: HttpResponse<any>) => {

            const token = this.cookieTokenStorage.get();
            const payload = token.getPayload();
            const id = payload.user.id;

            this.userSession.changeState({state: SessionState.valid, id});

            resolve({
              message: 'You have successfully logged in! Redirecting to the dashboard...',
              callback: () => {
                setTimeout(() => {
                  this.router.navigate(['/dashboard']);
                }, 2000);
                
              }
            });
          },
          (error: string) => {
            reject(error);
          }
        )
    });
  }

  logout(message?: string): Promise<boolean> | void {
    return new Promise<boolean>((resolve, reject) => {
      this.http
      .post<any>(
        `${this.authUrl}/logout`, 
        {headers: this.headers}
      )
      .pipe(
        catchError(this.handleResponseError)
      )
      .subscribe(
        res => {
          this.userSession.changeState({state: SessionState.loggedOut});

          // sending a message to the login page to notify user with the reason of log out since the last http request.
          this.router.navigate(['/auth/login'], {
              state: {
                ...message && {message}
              }
            })
            .then(val => {
              resolve(val);
            })
            .catch(error => reject(error))
        }
      );
    });
    
  }

  register(regData: any): Promise<SubmitResult> {
    return new Promise<SubmitResult>((resolve, reject) => {
      this.http
        .post<any>(
          `${this.authUrl}/register`, 
          this.dataToApiSchema(regData),
          {
            observe: 'response',
            headers: this.headers
          }
        )
        .pipe(
          catchError(this.handleResponseError)
        )
        .subscribe(
          (response: HttpResponse<any>) => {
            resolve({
              message: response.body.data.message, 
              callback: () => {
                // this.router.navigate(['/login']);
              }
            });
          },
          (errorMsg: string) => {
            reject(errorMsg);
          }
        )
    });
  }

  refreshToken() {}

  // kind of error filtering / mapping function
  handleResponseError(error: HttpErrorResponse) {
    // we are only forwarding a simple message to the client
    const logMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    const statusError = `${error.status}: ${error.statusText}`;
    
    let clientMessage;

    if (error.status >= 500) {
      clientMessage = 'A server error occured.';
    }
    else
    if (error.status >= 400) {
      // server received an unxpected request
      clientMessage = error.error.message;
    }
    else {
      clientMessage = error.error instanceof ErrorEvent ?  
      error.error.message : logMessage;
    }
    
    // logging error:
    console.error(logMessage);
   
    return throwError(clientMessage);
  }
}
