import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-alert-box',
  templateUrl: './alert-box.html',
  styleUrls: ['./alert-box.css'],})
export class AlertBoxComponent implements OnInit{
  type:any;
  isLoading:boolean=false;
  userId:any;
  isReadyToDeleteAccount=false;
  userEmailAddress='';
  passwordOfUser:any=null;
  isProvideFeedback:boolean=false;
  constructor(
    public authService:AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public snackBar:MatSnackBar,
    public dialog: MatDialog,
    public route:Router
  ){}
  
  ngOnInit(): void {
      this.type=this.data.type;
      this.userId=sessionStorage.getItem('Id')?.split(' ')[1];
      this.userEmailAddress =
        this.authService.getEmail() ?? localStorage.getItem('user_email') ?? '';
  }

  onLogout(){
    this.authService.onLogout();
  }

  onDeleteAccount(){
    if (this.userId === environment.adminId) {
      this.dialog.open(AlertBoxComponent, {
        data:{type:'admin'}
      });
      this.isLoading=false;
      return;
    }
    this.isProvideFeedback=true;
  }

  onNavigateWelcome(){
    this.route.navigate(['welcome']);
  }

  onConfirmPassword(){
    this.isLoading=true;
    let body={
      gmail: this.userEmailAddress,
      password:this.passwordOfUser,
    }
    this.authService.onConfirmAccess(body).subscribe((res:any)=>{
      this.isLoading=false;
      this.onConfirmPasswordAndDeleteAccount();
    },error=>{
      this.isLoading=false;
      console.log(error);
      this.snackBar.open(error.error.message,'',{duration:2000});
    })
  }

  onConfirmPasswordAndDeleteAccount(){
    this.isLoading=true;
    this.authService.deleteUserAccount().subscribe((res:any)=>{
      this.isLoading=false;
      this.authService.onLogout(false);
      this.snackBar.open('Account Deleted Successfully','',{duration:2000});
    });
    this.isLoading=false;
    this.dialog.closeAll()
  }

  handleSkip(event:any){
    this.isProvideFeedback=false;
    this.isReadyToDeleteAccount=true;
  }
}


