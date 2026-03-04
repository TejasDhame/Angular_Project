import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth';
import { BusinessDataService } from 'src/app/services/business-data';
import { AlertBoxComponent } from 'src/app/core/alert-box/alert-box';
import { ProfileComponent } from 'src/app/core/profile/profile';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.css'],})
export class HeaderComponent implements OnInit{
  // isLogging:boolean=true;
  isLoading: boolean=true;
  app_version:any;
  constructor(
    private route:Router,
    public dialog: MatDialog,
    public authService:AuthService,
    public businessData:BusinessDataService
  ){
    this.app_version=sessionStorage.getItem('Version');
  }
  ngOnInit(): void {
    this.isLoading=true;
    setTimeout(() => {
      this.isLoading=false;
    }, 4000);
    const token=sessionStorage.getItem('LEAD_ID');
    this.authService.authAfterReferesh(true,token);
  }
  openDialog(): void {
    this.dialog.open(ProfileComponent, {
      width: '600px',
    })
  }
  onView(){
    this.route.navigate(['dashboard']);
  }
  onLogout(){
    // this.authService.onLogout();
    this.dialog.open(AlertBoxComponent, {
      data:{type:'alert'}
    });
  }
}


