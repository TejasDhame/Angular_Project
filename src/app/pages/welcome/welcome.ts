import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth';
import { BusinessDataService } from 'src/app/services/business-data';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.html',
  styleUrls: ['./welcome.css'],})
export class WelcomeComponent implements OnInit{
  appVersion:any='';
  private pressTimer: any = null;
  private readonly LONG_PRESS_TIME = 1500;
  private longPressTriggered = false;

  constructor(
    public authService:AuthService,
    public _snackBar : MatSnackBar,
    public businessData:BusinessDataService,
    public activateroute:ActivatedRoute
   )
  {
    this.activateroute.queryParams.subscribe((p)=>{
      if(p['src']!=undefined && [p['src']!=null]){
        this.businessData.setComingSrc(p['src']);
      }
    });
  }
  ngOnInit(): void {
    const LoggedUser=sessionStorage.getItem('LEAD_ID');
    if(LoggedUser){
      this.authService.onLogout(false);
      this._snackBar.open('You have Logout Successfully','',{duration:3000});
    }
    if(!sessionStorage.getItem('Version')){
      this.authService.onGetAppVersion().subscribe((res:any)=>{
        this.businessData.setAppVersion(res.version);
        this.appVersion=this.businessData.getAppVersion();
      });
    }
    else{
      this.appVersion=sessionStorage.getItem('Version');
    }
  }

  /* ---------- Desktop ---------- */
  onDoubleClick() {
    this.goToAdmin();
  }

  /* ---------- Mobile Touch ---------- */
  onTouchStart() {
    this.longPressTriggered = false;
    this.startTimer();
  }

  onTouchEnd() {
    this.clearTimer();
  }

  onTouchCancel() {
    this.clearTimer();
  }

  /* ---------- Timer Control ---------- */
  private startTimer() {
    this.clearTimer();
    this.pressTimer = setTimeout(() => {
      this.longPressTriggered = true;
      this.goToAdmin();
    }, this.LONG_PRESS_TIME);
  }

  private clearTimer() {
    if (this.pressTimer) {
      clearTimeout(this.pressTimer);
      this.pressTimer = null;
    }
  }
  ngOnDestroy() {
    this.clearTimer();
  }

  private goToAdmin() {
    if (this.longPressTriggered || true) {
      this._snackBar.open('Admin backend is disabled in static mode.', '', { duration: 2500 });
    }
  }
}


