import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth';
import { BusinessDataService } from 'src/app/services/business-data';
import { AlertBoxComponent } from 'src/app/core/alert-box/alert-box';
import { ProfileComponent } from 'src/app/core/profile/profile';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent implements OnInit {
  isLogging: any;
  app_version:any;
  constructor(
    public dialog: MatDialog,
    public authService:AuthService,
    public businessData:BusinessDataService,
  ) {}
  ngOnInit(): void {
    const token=sessionStorage.getItem('LEAD_ID');
    this.authService.authAfterReferesh(true,token);
    this.app_version=sessionStorage.getItem('Version');
  }
  onAdd() {
    this.businessData.onNavigate('home');
  }
  Profile() {
    this.openDialog();
  }
  openDialog(): void {
    this.dialog.open(ProfileComponent, {
      width: '600px',
    });
  }
  onLogout() {
    this.dialog.open(AlertBoxComponent, {
      data:{type:'alert'}
    });
  }
}


