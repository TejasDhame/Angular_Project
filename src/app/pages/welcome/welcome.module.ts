import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeComponent } from './welcome';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { SharedModule } from 'src/app/core/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent,
    title:'Welcome | ExpenseTracker'
  },
];

@NgModule({
  declarations: [WelcomeComponent, LoginComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
})
export class WelcomeModule {}

