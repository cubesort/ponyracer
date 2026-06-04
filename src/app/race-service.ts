import { inject, Injectable } from '@angular/core';
import { RaceModel } from './models/race-model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RaceService {
  private readonly http = inject(HttpClient);

  list() {
    return this.http.get<Array<RaceModel>>(`${environment.baseUrl}/api/races`, {
      params: { status: 'PENDING' }
    });
  }
}
