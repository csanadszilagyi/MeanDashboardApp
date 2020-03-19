import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { UserListComponent } from './pages/user-list/user-list.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { UserResourceService } from './services/user-resource.service';
import { FormsModule } from '@angular/forms';
import { UserViewComponent } from './pages/user-view/user-view.component';

import { NgxSmartModalModule } from 'ngx-smart-modal';
import { ModalService } from './services/modal-service';

@NgModule({
  declarations: [
    DashboardComponent,
    UserListComponent, 
    ProfileComponent, 
    UserViewComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    NgxSmartModalModule.forChild()
  ],
  providers: [
    UserResourceService,
    ModalService
  ]
})
export class DashboardModule { }
