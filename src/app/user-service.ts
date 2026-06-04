import { HttpClient } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '../environments/environment';
import { UserModel } from './models/user-model';
import { tap } from 'rxjs';

const LOCAL_STORAGE_USER_KEY = 'rememberMe';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);

  private readonly user = signal<UserModel | undefined>(this.retrieveUser());

  readonly currentUser = this.user.asReadonly();

  constructor() {
    effect(() => {
      const user = this.user();
      if (user) {
        window.localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(this.user()));
      } else {
        window.localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      }
    });
  }

  authenticate(login: string, password: string) {
    return this.http
      .post<UserModel>(`${environment.baseUrl}/api/users/authentication`, { login, password })
      .pipe(tap(user => this.user.set(user)));
  }

  register(login: string, password: string, birthYear: number) {
    return this.http.post<UserModel>(`${environment.baseUrl}/api/users`, { login, password, birthYear });
  }

  logout() {
    this.user.set(undefined);
  }

  private retrieveUser(): UserModel | undefined {
    const user = window.localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return undefined;
  }
}
