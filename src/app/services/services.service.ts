import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Flights } from '../interfaces/Flights';

@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  routes: any = {
    uniqueRoutes: 0,
    multipleRoutes: 1,
    multipleRoutesAndReturn: 2,
  };
  constructor(private http: HttpClient) {}

  getFlights(level: string): Observable<Flights | null> {
    let url = `${environment.BASE_URL}${this.routes[level]}`;
    return this.http.get<Flights>(url).pipe(
      map((data: Flights) => {
        return data;
      }),
      catchError((error: any) => {
        console.error(error);
        return of(null);
      })
    );
  }
}
