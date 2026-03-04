import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/core/shared.module';
import { HeaderComponent } from './header';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/auth-guard';
import { DashboardComponent } from './dashboard/dashboard';
import { ImportComponent } from './import/import';
import { AddCategoryComponent } from './add-category/add-category';
import { AddExpenseComponent } from './add-expense/add-expense';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: HeaderComponent,
    canActivate: [AuthGuard],
    title:'Home | ExpenseTracker'
  },
];

@NgModule({
  declarations: [
    HeaderComponent,
    DashboardComponent,
    ImportComponent,
    AddCategoryComponent,
    AddExpenseComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes),
  ],
})
export class HeaderModule {}

