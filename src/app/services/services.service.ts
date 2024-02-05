import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Jorneys } from '../interfaces/Jorneys';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  routes: any = {
    uniqueRoutes: 0,
    multipleRoutes: 1,
    multipleRoutesAndReturn: 2,
  };
  constructor(private http: HttpClient) {}

  getJourney(params: any): Observable<Jorneys | null> {
    let searchParams: string = `origin=${params.origin}&destination=${
      params.destination
    }${params.numberFlights ? '&flyLimit=' + params.numberFlights : ''}`;

    let url = `${environment.BASE_URL}?${searchParams}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.get<Jorneys>(url, { headers }).pipe(
      map((data: Jorneys) => {
        return data;
      }),
      catchError((error: any) => {
        console.error(error);
        return of(null);
      })
    );
  }
}
