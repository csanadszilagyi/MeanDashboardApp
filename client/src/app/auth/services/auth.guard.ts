import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivateChild } from '@angular/router';
import { Observable, empty } from 'rxjs';
import { UserSessionService} from '../../core/services/user-session.service';
import { SessionState } from 'src/app/misc/utils';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(public router: Router, public userSession: UserSessionService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree 
  {
    if (this.userSession.currentState.state !== SessionState.valid) {
      //console.log('can not activate - navigating to login');
      this.router.navigate(['/auth/login']);
      // this.router.navigate(['/dashboard']);
    }
    //console.log('true - can activate');
    return true;
    
    
  }
  
}
