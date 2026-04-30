import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface WorldCupConfig {
  startDate: string;
}

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private apiUrl = 'http://localhost:3000/config';

  constructor(private http: HttpClient) {}

  getWorldCupDate(): Observable<WorldCupConfig> {
    return this.http.get<WorldCupConfig>(`${this.apiUrl}/world-cup`);
  }
}
