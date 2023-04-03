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
export class ConfigsService {
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(private http: HttpClient) { }

  rolesUrl = `${environment.API}/api/v1/product/configuration/`;

  public getConfigs(): Observable<any> {
    return this.http.get<any>(this.rolesUrl + 'get');
  }

  addNewConfiguration(data: any): Observable<any> {
    return this.http.post(this.rolesUrl + 'add', data, httpOptions);
  }

  updateConfiguration(data: any): Observable<any> {
    return this.http.put(this.rolesUrl + 'update', data, httpOptions);
  }

  deleteConfiguration(id: any): Observable<any> {
    return this.http.delete(this.rolesUrl + `delete/` + id, httpOptions);
  }

  getRoutes(): Observable<any> {
    return this.http.get<any>(`${environment.API}/api/v1/routes/get`, httpOptions);
  }
}
