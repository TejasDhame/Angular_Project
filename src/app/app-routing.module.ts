import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth-guard';
import { AddExpenseComponent } from './pages/home/add-expense/add-expense';

const routes: Routes = [
  {
    path:'home',
    loadChildren:()=>import('./pages/home/header.module').then((m)=>m.HeaderModule),
  },

  {
    path:'welcome',
    loadChildren:()=>import('./pages/welcome/welcome.module').then((m)=>m.WelcomeModule),
  },

  {
    path:'edit/:id',
    component:AddExpenseComponent,
    canActivate:[AuthGuard],
    title:'Edit Expense | ExpenseTracker'
  },
  
  {
    path:'dashboard',
    loadChildren:()=>import("./pages/dashboard/home.module").then((m)=>m.HomeModule),
  },
  
  {path:'**', redirectTo:'welcome'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[AuthGuard]
})
export class AppRoutingModule { }

