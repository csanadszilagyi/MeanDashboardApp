import { Component, OnInit } from '@angular/core';
import { RegData } from 'src/app/misc/utils';
import { FormHandler } from 'src/app/misc/form-handler';
import { UserResourceService } from '../../services/user-resource.service';
import { User } from 'src/app/core/models/user.model';
import { UserSessionService } from 'src/app/core/services/user-session.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent extends FormHandler<RegData> implements OnInit {

  user: User;

  constructor(private userResourceService: UserResourceService,
              private userSessionService: UserSessionService) { 
    super(RegData);
  }

  save(): void {
    this.user = { ...this.user, ...this.formData};
    console.log(this.user);

    this.userResourceService.update(this.user)
      .subscribe(
        result => {
          console.log(result);
          this.submissionSuccess({message: result.data.message});
        }
      );
  }

  submitFunc(): void {
    this.save();
  }

  ngOnInit(): void {
    const id: string = this.userSessionService.currentState.id || '0';
    this.userResourceService.read<string>(id)
      .subscribe(
        (userData: User) => {
          this.user = userData;
          
          this.formData = Object.assign(this.formData, userData);
          console.log(this.formData);
        },
        error => {
          console.log(error);
        });
  }

}