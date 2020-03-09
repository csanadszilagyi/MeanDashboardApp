import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-back-link',
  template: `
  <a [routerLink]="[link]" class="back-link">
    <i class="fas fa-chevron-left align-baseline"></i>
    {{ title }}
  </a>
  `,
  styles: ['.back-link { text-decoration: none}']
})
export class BackLinkComponent implements OnInit {

  @Input('link') link: string = '';
  @Input('title') title: string = '';

  // ['/auth/login']
  constructor() { }

  ngOnInit(): void {
  }

}
