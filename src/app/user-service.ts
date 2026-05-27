import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_BASE_URL } from './tokens';
import { UserModel } from './models/user-model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  authenticate(login: string, password: string) {
    return this.http.post<UserModel>(`${this.baseUrl}/api/users/authentication`, { login, password });
  }

  register(login: string, password: string, birthYear: number) {
    return this.http.post<UserModel>(`${this.baseUrl}/api/users`, { login, password, birthYear });
  }
}
