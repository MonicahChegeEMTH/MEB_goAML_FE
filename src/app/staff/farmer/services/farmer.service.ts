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
export class FarmerService {

  headers = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(private http: HttpClient) { }



  public getFarmers(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/v1/farmer/get`,httpOptions);
  }
  public getFarmersById(id:any): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/v1/farmer/id`,httpOptions);
  }
  registerFarmer(farmer:any){
    return this.http.post(`${environment.apiUrl}/api/v1/farmer/add`,farmer);
  }


  public getSubCounties(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/v1/Subcounty/fetch`);
  }

  public getSubCountyById(id:any): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/v1/Subcounty/` + id);
  }
  
}
