import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SessionState } from 'src/app/misc/utils';

export interface UserSessionData {
  id?: string;
  email?: string;
  state?: SessionState;
}

@Injectable()
export class UserSessionService {

  userState$: BehaviorSubject<UserSessionData> = new BehaviorSubject<UserSessionData>({state: SessionState.invalid});
  userStateObs: Observable<UserSessionData> = this.userState$.asObservable();

  constructor() { }

  get currentState(): UserSessionData {
    return this.userState$.value; 
  }

  changeState(state: UserSessionData): void {
    const newState = {...this.currentState, ...state};
    // console.log(newState);
    this.userState$.next(newState);
  }
}
