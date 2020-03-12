import { NgModule, Optional, SkipSelf, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './pages/login/login.component';
import { LogoutComponent } from './pages/logout/logout.component';
import { AuthService } from './services/auth.service';
import { JwtInterceptor } from './services/jwt.interceptor';
import { AuthGuard } from './services/auth.guard';
import { FormsModule } from '@angular/forms';
import { CookieTokenStorage } from './token/cookie-token-storage';
import { RegisterComponent } from './pages/register/register.component';
import { CoreModule } from '../core/core.module';
import { CookieTokenService } from './token/cookie-token-service';

export const AUTH_PROVIDERS = [
  AuthService,
  JwtInterceptor,
  AuthGuard,
  CookieTokenService,
  CookieTokenStorage
];

@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    LogoutComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    CoreModule
  ],
  providers: [
    AuthService,
    CookieTokenService,
    CookieTokenStorage
  ],
  exports: [
    AuthComponent,
    LoginComponent,
    LogoutComponent
  ]
})
export class AuthModule {

  constructor(@Optional() @SkipSelf() parentModule: AuthModule) {
    if (parentModule) {
        throw new Error(`${parentModule} has already been loaded. Import auth module in the AppModule only.`);
    }
  }

  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: AuthModule,
      providers: [
        ...AUTH_PROVIDERS,
      ],
    };
  }
  
}
