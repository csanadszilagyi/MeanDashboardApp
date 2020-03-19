import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserResourceService } from '../../services/user-resource.service';
import { User } from 'src/app/core/models/user.model';
import { FormHandler } from 'src/app/misc/form-handler';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss']
})
export class UserViewComponent extends FormHandler<User> implements OnInit {

  constructor(private route: ActivatedRoute,
              private userResourceService: UserResourceService) {        
    super(User, {});
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id').toString();
    this.getUser(id);
  }

  getUser(id: string) {
    this.userResourceService.read<string>(id)
      .subscribe((user: User) => {
        this.formData = user;
      });
  }

  save(): void {

    this.userResourceService.update(this.formData)
      .subscribe(
        result => {
          this.submissionSuccess({message: result.data.message});
        }
      );
  }

  submitFunc(): void {
    this.save();
  }

}
