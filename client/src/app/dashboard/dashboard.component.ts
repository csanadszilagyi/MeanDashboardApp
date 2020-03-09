import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../misc/router-transitions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [routerTransition]
})
export class DashboardComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {}

  getState(outlet) {
    return outlet.isActivated ? outlet.activatedRouteData : '';
  }
}
