import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { UserListComponent } from './pages/user-list/user-list.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { UserResourceService } from './services/user-resource.service';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DashboardComponent,
    UserListComponent, 
    ProfileComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule
  ],
  providers: [
    UserResourceService
  ]
})
export class DashboardModule { }
