import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class SalesService {

  headers = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(private http: HttpClient) { }


  getCollections(date:string){
    return this.http.get(`${environment.apiUrl}/api/v1/collections/specific/date?date=`+date,httpOptions);


  }
  getTodayCollections(){
    return this.http.get(`${environment.apiUrl}/api/v1/collections/collections/today/collector`,httpOptions);

  }
  // getTodayCollectionsPerCollector(){
  //   return this.http.get(`${environment.apiUrl}/api/v1/collections/collections/today/collector`,httpOptions);

  // }
  
  allocateFloat(){
    return this.http.get(`${environment.apiUrl}/api/v1/collections/collections/today/collector`,httpOptions);

  }
  getCollectorAllocations(){
    return this.http.get(`${environment.apiUrl}/api/v1/float/get/allocations`,httpOptions);

  }
  getFarmerCollections(id:any){
    return this.http.get(`${environment.apiUrl}/api/v1/collections/per/farmer?farmerId=`+id,httpOptions);


  }
}
