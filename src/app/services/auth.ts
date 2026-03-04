import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { STATIC_APP_VERSION, STATIC_USER } from '../models/static-user.data';

const PROFILE_STORAGE_KEY = 'expense_tracker_profile';
const SESSION_TOKEN_KEY = 'LEAD_ID';
const SESSION_USER_ID_KEY = 'Id';
const EMAIL_STORAGE_KEY = 'user_email';

interface LocalProfile {
  firstLoginDate: string;
  username: string;
  name: string;
  lastLoginDate: string;
  userId: string;
  expenseLogged: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuth = false;
  private token: string | null = null;
  private userId: string | null = null;
  private emailAddress: string | null = null;

  constructor(
    public _snackBar: MatSnackBar,
    public route: Router
  ) {}

  authAfterReferesh(isAuth: boolean, token: string | null) {
    this.isAuth = isAuth && !!token;
    this.token = token;
    this.userId = STATIC_USER.id;
    this.emailAddress =
      localStorage.getItem(EMAIL_STORAGE_KEY) ?? STATIC_USER.gmail;
  }

  getToken(): string | null {
    return this.token;
  }

  getIsAuth(): boolean {
    return this.isAuth;
  }

  getUSerId(): string | null {
    return this.userId;
  }

  getEmail(): string | null {
    return this.emailAddress;
  }

  setEmail(email: string) {
    localStorage.setItem(EMAIL_STORAGE_KEY, email);
    this.emailAddress = email;
  }

  onSignUp(values: any): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this._snackBar.open(
        'Signup is disabled in static mode. Use the configured login.',
        '',
        { duration: 4000 }
      );
      this.isAuth = false;
      reject(values);
    });
  }

  onLogin(body: any): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const isValidUser =
        body?.gmail === STATIC_USER.gmail && body?.password === STATIC_USER.password;

      if (isValidUser) {
        this._snackBar.open('Login successful', '', { duration: 3000 });
        this.token = 'local-static-session-token';
        this.isAuth = true;
        this.userId = STATIC_USER.id;
        this.setEmail(STATIC_USER.gmail);
        this.saveAuthDataonLocalStorage(STATIC_USER.id);
        this.updateUserData(STATIC_USER.id, {
          lastLoginDate: new Date().toISOString(),
        });
        resolve(true);
        return;
      }

      this._snackBar.open('Invalid email or password', '', { duration: 3000 });
      this.isAuth = false;
      reject(body);
    });
  }

  onLogout(showMessage = true, message = 'You have logged out successfully') {
    this.token = null;
    this.isAuth = false;
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
    sessionStorage.removeItem(SESSION_USER_ID_KEY);
    localStorage.removeItem(SESSION_TOKEN_KEY);
    localStorage.removeItem(SESSION_USER_ID_KEY);
    if (showMessage) {
      this._snackBar.open(message, '', { duration: 3000 });
    }
    this.route.navigate(['welcome']);
  }

  updateUserData(id: string, body: any) {
    const existing = this.getOrCreateLocalProfile();
    const updated: LocalProfile = {
      ...existing,
      ...body,
      userId: id,
    };
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));
  }

  saveAllData(body: any) {
    const existing = this.getOrCreateLocalProfile();
    const updated: LocalProfile = {
      ...existing,
      ...body,
    };
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));
  }

  deleteUserAccount(): Observable<any> {
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    localStorage.removeItem('expense_tracker_expenses');
    localStorage.removeItem('expense_tracker_categories');
    return of({ status: true, message: 'Account Deleted Successfully' });
  }

  onGetAppVersion(): Observable<any> {
    return of({ version: STATIC_APP_VERSION });
  }

  saveSource(email: string, action: string, source: string) {
    const event = {
      email,
      source,
      action,
      createdAt: new Date().toISOString(),
    };
    const existingRaw = localStorage.getItem('expense_tracker_sources');
    const existing = existingRaw ? JSON.parse(existingRaw) : [];
    existing.push(event);
    localStorage.setItem('expense_tracker_sources', JSON.stringify(existing));
  }

  onProvideFeedback(body: any): Observable<any> {
    const existingRaw = localStorage.getItem('expense_tracker_feedback');
    const existing = existingRaw ? JSON.parse(existingRaw) : [];
    existing.push(body);
    localStorage.setItem('expense_tracker_feedback', JSON.stringify(existing));
    return of({ status: true });
  }

  onConfirmAccess(body: any): Observable<any> {
    const hasAccess =
      body?.gmail === STATIC_USER.gmail && body?.password === STATIC_USER.password;
    if (hasAccess) {
      return of({ status: true, message: 'Access confirmed' });
    }
    return throwError(() => ({ error: { message: 'Invalid password' } }));
  }

  private getOrCreateLocalProfile(): LocalProfile {
    const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as LocalProfile;
    }
    const now = new Date().toISOString();
    const profile: LocalProfile = {
      firstLoginDate: now,
      username: STATIC_USER.username,
      name: STATIC_USER.name,
      lastLoginDate: now,
      userId: STATIC_USER.id,
      expenseLogged: 0,
    };
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    return profile;
  }

  private saveAuthDataonLocalStorage(userId: string) {
    const wrappedUserId = `954854384ubbbfhf9489r34r34fnnn ${userId} id`;
    sessionStorage.setItem(SESSION_TOKEN_KEY, this.token ?? '');
    sessionStorage.setItem(SESSION_USER_ID_KEY, wrappedUserId);
    localStorage.setItem(SESSION_TOKEN_KEY, this.token ?? '');
    localStorage.setItem(SESSION_USER_ID_KEY, wrappedUserId);
  }
}

