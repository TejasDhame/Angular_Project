import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { STATIC_EXPENSES, StaticExpense } from '../models/expenses.data';
import { STATIC_USER } from '../models/static-user.data';

const EXPENSES_STORAGE_KEY = 'expense_tracker_expenses';
const CATEGORIES_STORAGE_KEY = 'expense_tracker_categories';
const PROFILE_STORAGE_KEY = 'expense_tracker_profile';

@Injectable({
  providedIn: 'root',
})
export class BusinessDataService {
  
  isLogging: boolean = false;
  isChecking:boolean=false;
  hashmap:any={};
  public pieDialogRef:any;
  pieLabels:any=[];
  piedata:any=[];
  chartType:any;
  expensesLogged: any = 0;
  latestLoginDate: any = '';
  firstLoginDate: any = '';
  keywords: any;
  data: any;
  userId: any;
  private appVersion: any = '';
  private comingSrc: any = 'Direct';

  constructor(private route: Router) {}

  getAppVersion() {
    return this.appVersion;
  }

  setAppVersion(version: any) {
    this.appVersion = version;
    sessionStorage.setItem('Version', this.appVersion);
  }

  setComingSrc(val: any) {
    this.comingSrc = val;
  }

  getComingSrc() {
    return this.comingSrc;
  }

  getUserIdFromSS() {
    return this.extractUserId(sessionStorage.getItem('Id')) ?? STATIC_USER.id;
  }

  onHome(){
    this.route.navigate(['home']);
  }
  onNavigate(url: any) {
    this.route.navigate([url]);
  }

  onGetAllExpense(id: any): Observable<any> {
    this.userId = id;
    return of({ status: true, data: this.getStoredExpenses() });
  }

  onCreateExpense(values: any, date: any): Observable<any> {
    const id = this.getUserIdFromSS();
    const expenseDate = this.formatExpenseDate(values?.expense_date, date);
    const body = {
      _id: this.generateId(),
      name: values.name,
      amount: Number(values.amount),
      expense_date: expenseDate,
      expense_category: values.expense_category,
      payment: values.payment,
      comment: values.comment,
      creater: id,
    };
    const expenses = this.getStoredExpenses();
    expenses.push(body);
    this.saveStoredExpenses(expenses);
    this.ensureCategoryExists(values.expense_category);
    return of({ status: true, data: body });
  }


  onImportExpense(values: any): Observable<any> {
    const id = this.getUserIdFromSS();
    const dateParts = values.expense_date.split('/');
    const asDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
    const formattedDate = this.dateToExpenseString(asDate);
    const body = {
      _id: this.generateId(),
      name: values.expense_name,
      amount: values.amount,
      expense_date: formattedDate,
      expense_category: values.expense_category,
      payment: values.payment_type,
      comment: values.comment,
      creater: id,
    };
    const expenses = this.getStoredExpenses();
    expenses.push(body);
    this.saveStoredExpenses(expenses);
    this.ensureCategoryExists(values.expense_category);
    return of({ status: true, data: body });
  }


  onCreateCategory(body: any): Observable<any> {
    const categories = this.getStoredCategories();
    const merged = [...categories];
    for (const category of body) {
      if (category && !merged.includes(category)) {
        merged.push(category);
      }
    }
    this.saveStoredCategories(merged);
    return of({ status: true, data: merged });
  }

  onEditCategory(body: any): Observable<any> {
    this.saveStoredCategories(body);
    return of({ status: true, data: body });
  }
  
  onDeleteExpense(id: string): Observable<any> {
    const expenses = this.getStoredExpenses().filter((expense) => expense._id !== id);
    this.saveStoredExpenses(expenses);
    return of({ status: true, message: 'Expense Deleted' });
  }

  onGetSingleExpense(id: string): Observable<any> {
    const expense = this.getStoredExpenses().find((item) => item._id === id);
    return of({ status: !!expense, data: expense ?? null });
  }

  onUpdateExpense(id: string, values: any): Observable<any> {
    const expenses = this.getStoredExpenses();
    const idx = expenses.findIndex((expense) => expense._id === id);
    if (idx === -1) {
      return of({ status: false });
    }
    expenses[idx] = {
      ...expenses[idx],
      name: values.name,
      amount: Number(values.amount),
      expense_date: this.formatExpenseDate(values.expense_date, null),
      expense_category: values.expense_category,
      payment: values.payment,
      comment: values.comment,
    };
    this.saveStoredExpenses(expenses);
    this.ensureCategoryExists(values.expense_category);
    return of({ status: true, data: expenses[idx] });
  }

  onGetAllCategory(): Observable<any> {
    this.userId = this.getUserIdFromSS();
    return of({ status: true, data: this.getStoredCategories() });
  }
  
  onGithub(){
    const link=document.createElement('a');
    link.target="_blank";
    link.href="https://github.com/grraghav120";
    link.click();
  }
  onLinkedin(){
    const link=document.createElement('a');
    link.target="_blank";
    link.href="https://www.linkedin.com/in/raghavgarg2002/";
    link.click();
  }
  
  updateProfile(body: any): Observable<any> {
    const profile = this.getOrCreateProfile();
    const nextProfile = { ...profile, ...body };
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(nextProfile));
    return of({ status: true, data: nextProfile });
  }

  updateWholeInfo(body: any): Observable<any> {
    return this.updateProfile(body);
  }

  getAllSaveData(): Observable<any> {
    return of({ status: true, data: this.getOrCreateProfile() });
  }

  private getStoredExpenses(): StaticExpense[] {
    const raw = localStorage.getItem(EXPENSES_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as StaticExpense[];
    }
    const seeded = STATIC_EXPENSES.map((expense) => ({ ...expense }));
    localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }

  private saveStoredExpenses(expenses: any[]) {
    localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(expenses));
  }

  private getStoredCategories(): string[] {
    const raw = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as string[];
    }
    const defaults = ['Transportation', 'Groceries', 'Entertainment', 'Unassigned'];
    const fromData = this.getStoredExpenses().map((expense) => expense.expense_category);
    const categories = Array.from(new Set([...defaults, ...fromData]));
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    return categories;
  }

  private saveStoredCategories(categories: string[]) {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
  }

  private ensureCategoryExists(category: string) {
    const categories = this.getStoredCategories();
    if (category && !categories.includes(category)) {
      categories.push(category);
      this.saveStoredCategories(categories);
    }
  }

  private getOrCreateProfile(): any {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
    const now = new Date().toISOString();
    const profile = {
      firstLoginDate: now,
      username: STATIC_USER.username,
      name: STATIC_USER.name,
      lastLoginDate: now,
      userId: STATIC_USER.id,
      expenseLogged: this.getStoredExpenses().length,
    };
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    return profile;
  }

  private generateId(): string {
    return `exp-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  private extractUserId(rawId: string | null): string | null {
    if (!rawId) {
      return null;
    }
    const parts = rawId.split(' ');
    if (parts.length >= 2) {
      return parts[1];
    }
    return rawId;
  }

  private formatExpenseDate(formDate: any, splitDate: string[] | null): string {
    if (splitDate && splitDate.length >= 4) {
      return `${splitDate[0]} ${splitDate[1]} ${splitDate[2]} ${splitDate[3]}`;
    }
    if (formDate instanceof Date) {
      return this.dateToExpenseString(formDate);
    }
    if (typeof formDate === 'string') {
      return formDate;
    }
    return this.dateToExpenseString(new Date());
  }

  private dateToExpenseString(date: Date): string {
    const full = date.toDateString();
    const parts = full.split(' ');
    return `${parts[0]} ${parts[1]} ${parts[2]} ${parts[3]}`;
  }
}

