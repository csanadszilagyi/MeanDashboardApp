import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, empty, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { UserSessionService } from 'src/app/core/services/user-session.service';
import { SessionState } from 'src/app/misc/utils';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private injector: Injector) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const userState = this.userSessionService.currentState.state;
    
    return next.handle(req)
      .pipe(
        catchError((error: any, caught: Observable<HttpEvent<unknown>>) => {
          if (userState === SessionState.valid && this.isUnAuthorized(error)) {
              // redirect to logout
              this.authService.logout('Your session has expired. Please login again.');
              return empty();
            
          }
          return throwError(error);
        })
      );
  }

  protected isUnAuthorized(error: any): boolean {
    return error instanceof HttpErrorResponse && error.status === 401;
  }

  private get authService(): AuthService {
    return this.injector.get(AuthService);
  }

  private get userSessionService(): UserSessionService {
    return this.injector.get(UserSessionService);
  }
}
