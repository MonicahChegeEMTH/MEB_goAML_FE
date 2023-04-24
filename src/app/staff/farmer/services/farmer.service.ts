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
    return this.http.get(`${environment.apiUrl}/api/v1/farmer/all`,httpOptions);
  }
  public getByFarmersByFarmerNo(farmer_no:any): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/v1/farmer/membernumber?farmer_number=`+farmer_no,httpOptions);
  }
  public getFarmersById(id:any): Observable<any> {
    console.log("Calling api ...")
    console.log(`${environment.apiUrl}/api/v1/farmer/farmer/id?farmerId=`+id)
    return this.http.get(`${environment.apiUrl}/api/v1/farmer/farmer/id?farmerId=`+id,httpOptions);
  }
  registerFarmer(farmer:any){
    return this.http.post(`${environment.apiUrl}/api/v1/farmer/add`,farmer);
  }
  updateFarmer(farmer:any){
    return this.http.put(`${environment.apiUrl}/api/v1/farmer/update`,farmer);
  }


  public getSubCounties(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/v1/Subcounty/fetch`);
  }

  public getSubCountyById(id:any): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/v1/Subcounty/` + id);
  }
  public getFarmerStatement(id:any): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/v1/reports/farmer/statement?farmerid=` + id);
  }
  
}
