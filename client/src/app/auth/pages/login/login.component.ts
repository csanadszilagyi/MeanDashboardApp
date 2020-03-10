import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginData, SubmitResult, FormStatus } from 'src/app/misc/utils';
import { AuthService } from '../../services/auth.service';
import { FormHandler } from 'src/app/misc/form-handler';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends FormHandler<LoginData> implements OnInit {

  initialMessage: string = '';

  constructor(public activatedRoute: ActivatedRoute,
              public router: Router, 
              public auth: AuthService) {
    super(LoginData);
    this.initialMessage = this.router.getCurrentNavigation()?.extras?.state?.message || '';
  }

  ngOnInit(): void {
    if (this.initialMessage !== '') {
      this.setFormState({type: FormStatus.ERROR, message: this.initialMessage});
    }
  }

  login(): void {
    this.auth.login(this.formData)
      .then((result: SubmitResult) => {
        this.submissionSuccess(result);
      })
      .catch((errorMsg: string) => {
        this.submissionFail(errorMsg);
      });  
  }

  // overrided
  submitFunc(): void {
    this.login();
  }

  gotoRegistration($event) {
    $event.preventDefault();
    this.router.navigate(['/auth/register']);
  }
}
