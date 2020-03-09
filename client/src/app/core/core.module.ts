import { NgModule, APP_INITIALIZER, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';
import { AppConfigService } from './services/app-config.service';
import { UserSessionService } from './services/user-session.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BackLinkComponent } from './components/back-link/back-link.component';
import { RouterModule } from '@angular/router';

export function initializeApp(appConfig: AppConfigService) {
  return () => appConfig.load();
}

export const CORE_PROVIDERS = [
    UserSessionService, 
    AppConfigService,
    { 
        provide: APP_INITIALIZER,
        useFactory: initializeApp,
        deps: [AppConfigService], multi: true
    } 
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        RouterModule
    ],
    declarations: [
    BackLinkComponent
    ],
    exports: [
      BackLinkComponent
    ],
})
export class CoreModule {

    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error(`${parentModule} has already been loaded. Import Core modules in the AppModule only.`);
        }
    }
  
    static forRoot(): ModuleWithProviders {
      return <ModuleWithProviders>{
        ngModule: CoreModule,
        providers: [
          ...CORE_PROVIDERS,
        ],
      };
    }
  }