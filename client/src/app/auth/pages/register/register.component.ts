import { Component, OnInit } from '@angular/core';
import { FormHandler } from 'src/app/misc/form-handler';
import { AuthService } from '../../services/auth.service';
import { RegData, SubmitResult } from '../../../misc/utils';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends FormHandler<RegData> implements OnInit {

  // formData: RegData = new RegData();

  constructor(public auth: AuthService) { 
    super(RegData);
  }

  register(): void {
    this.auth.register(this.formData)
      .then((result: SubmitResult) => {
          this.submissionSuccess(result);
        },
      )
      .catch((errorMsg: string) => {
          this.submissionFail(errorMsg);
        }
      );
  }

  submitFunc(): void {
    this.register();
  }

  ngOnInit(): void {
  }
}
