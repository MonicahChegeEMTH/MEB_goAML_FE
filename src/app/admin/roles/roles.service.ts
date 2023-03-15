import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  headers = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(private http: HttpClient) { }

  rolesUrl = `${environment.API}/api/v1/roles/`;

  public getRoles(): Observable<any> {
    return this.http.get<any>(this.rolesUrl + 'view');
  }

  addNewRole(data: any): Observable<any> {
    return this.http.post(this.rolesUrl + 'add', data, httpOptions);
  }

  updateRole(data: any): Observable<any> {
    return this.http.put(this.rolesUrl + 'update', data, httpOptions);
  }

  deleteRole(id: any): Observable<any> {
    return this.http.delete(this.rolesUrl + `delete/` + id, httpOptions);
  }

  getAccessPrivileges(): Observable<any> {
    return this.http.get<any>(this.rolesUrl + 'access-rights');
  }

}
