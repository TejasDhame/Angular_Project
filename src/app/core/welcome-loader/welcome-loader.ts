import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-welcome-loader',
  templateUrl: './welcome-loader.html',
  styleUrls: ['./welcome-loader.css'],})
export class WelcomeLoaderComponent {
  @Input() msg :any;
  ngOnInit(){
  }
}
