import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(public auth: AuthService) { }

  ngOnInit(): void {
    this.logout();
  }

  logout() {
    this.auth.logout();
    /*
    setTimeout(() => {
      this.auth.logout();
    }, 1000);
    */
  }
}
