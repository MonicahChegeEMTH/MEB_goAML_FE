import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  headers = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(private http: HttpClient) { }




  public getTodaysCollections(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/v1/collections/collections/today`,httpOptions);
  }

  // public getUsersPerDepartment(): Observable<any> {
  //   return this.http.get(`${environment.apiUrl}api/v1/collections/collections/today`,httpOptions);
  // }

  // public getDashboardWigetsAnalytics(): Observable<any> {
  //   return this.http.get(`${environment.apiUrl}api/v1/collections/collections/today`,httpOptions);
  // }

  // public getUsersPerRole(): Observable<any> {
  //   return this.http.get(`${environment.apiUrl}api/v1/collections/collections/today`,httpOptions);
  // }

 
}
