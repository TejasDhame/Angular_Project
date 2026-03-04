import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrls: ['./footer.css'],})
export class FooterComponent {
  app_version:any;
  constructor(){this.app_version=sessionStorage.getItem('Version');}
}

