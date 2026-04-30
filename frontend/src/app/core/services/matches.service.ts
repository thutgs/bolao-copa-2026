import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Match {
  id: number;
  teamA: string;
  teamB: string;
  flagAUrl: string;
  flagBUrl: string;
  date: string;
  time: string;
  estadio: string;
  status: string;
  placarA?: number;
  placarB?: number;
}

@Injectable({
  providedIn: 'root'
})
export class MatchesService {
  private readonly API_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getNextMatches(limit: number = 4): Observable<Match[]> {
    return this.http.get<Match[]>(`${this.API_URL}/jogos/next?limit=${limit}`);
  }
}
