import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/auth-guard';
import {
  Confirm,
  ViewExpensesComponent,
} from './view-expenses/view-expenses';
import { SharedModule } from 'src/app/core/shared.module';
import { ViewSingleComponent } from './view-single/view-single';
import { ShowChartComponent } from './show-chart/show-chart';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    title:'Dashboard | ExpenseTracker'
  },
];

@NgModule({
  declarations: [
    HomeComponent,
    ViewExpensesComponent,
    Confirm,
    ViewSingleComponent,
    ShowChartComponent,
  ],

  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
})
export class HomeModule {}

