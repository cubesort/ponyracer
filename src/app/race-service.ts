import { inject, Injectable } from '@angular/core';
import { RaceModel } from './models/race-model';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from './tokens';

@Injectable({
  providedIn: 'root'
})
export class RaceService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  list() {
    return this.http.get<Array<RaceModel>>(`${this.baseUrl}/api/races`, {
      params: { status: 'PENDING' }
    });
  }
}
