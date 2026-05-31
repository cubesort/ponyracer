import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { API_BASE_URL } from './tokens';
import { UserModel } from './models/user-model';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  private readonly user = signal<UserModel | undefined>(undefined);

  readonly currentUser = this.user.asReadonly();

  authenticate(login: string, password: string) {
    return this.http
      .post<UserModel>(`${this.baseUrl}/api/users/authentication`, { login, password })
      .pipe(tap(user => this.user.set(user)));
  }

  register(login: string, password: string, birthYear: number) {
    return this.http.post<UserModel>(`${this.baseUrl}/api/users`, { login, password, birthYear });
  }

  logout() {
    this.user.set(undefined);
  }
}
