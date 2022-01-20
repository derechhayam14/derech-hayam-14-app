import { environment } from './../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../auth/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  logIn = false;
  user = new BehaviorSubject<User | null>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient,
              private router: Router) { }

  signUp(email: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}auth/signup`,
    {
      email,
      password
    })
    .pipe(
      catchError(this.handleError),
    );
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}auth/signin`,
    {
      email,
      password
    })
    .pipe(
      catchError(this.handleError),
      tap(u => {
        // console.log(u);
      this.handelAuthentication(email,u.username, u.accessToken, +u.expiresIn);
    }));
  }

  logout() {
    // this.logIn = false;
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearInterval(this.tokenExpirationTimer);
    }
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  setLogoutTimer(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  clearLogoutTimer() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

  handelAuthentication(email: string, username: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
      const user = new User(email, username, token, expirationDate);
      this.user.next(user);
      this.autoLogout(expiresIn * 1000);
      localStorage.setItem('userData', JSON.stringify(user));
  }

  isAouthenticated() {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.logIn);
      }, 800);
    });
    return promise;
  }

  autoLogin() {
    const sUser: string | null = localStorage.getItem('userData');
    const strUser = (!sUser) ? '' : sUser;
    if (strUser == '') {
      return;
    }
    const user: {
      email: string;
      username: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(strUser);
    if (!user) {
      return;
    }
    const loadUser = new User(user.email, user.username, user._token, new Date(user._tokenExpirationDate));
    if (loadUser.token) {
      this.user.next(loadUser);

      const expirationDuration = new Date(user._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  handleError(e: HttpErrorResponse) {
    let errorMessage = 'An unknow error occurred!';
    if (!e.error || !e.error.error) {
      return throwError(errorMessage);
    }
    switch (e.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct';
        break;
      case 'USER_DISABLED':
        errorMessage = 'User disabled';
        break;
    }
    console.log(e);
    return throwError(errorMessage);
  }
}
