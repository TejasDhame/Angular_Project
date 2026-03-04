import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProfileComponent } from 'src/app/core/profile/profile';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class DashboardComponent implements OnInit {
  keywords: any;
  constructor(
    private route: Router,
    public dialog: MatDialog
  ) {}
  ngOnInit(): void {
    
  }
  handleCategory(event:any){
    this.keywords=event;
  }

  openDialog(): void {
    this.dialog.open(ProfileComponent, {
      width: '600px',
    });
  }

  onView() {
    this.route.navigate(['dashboard']);
  }
}


