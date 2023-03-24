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
export class SalesService {

  headers = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(private http: HttpClient) { }


  getCollections(date: string) {
    return this.http.get(`${environment.apiUrl}/api/v1/collections/specific/date?date=` + date, httpOptions);
  }

  getAllCollections() {
    return this.http.get(`${environment.apiUrl}/api/v1/collections/all`, httpOptions);
  }

  getTodayCollections() {
    return this.http.get(`${environment.apiUrl}/api/v1/collections/collections/today/collector`, httpOptions);

  }
  getCollectionsDateRange(fromDate: any, toDate: any) {
    return this.http.get(`${environment.apiUrl}/api/v1/collections/date/range?fromdate=${fromDate}&toDate=${toDate}`, httpOptions);
  }

  allocateFloat() {
    return this.http.get(`${environment.apiUrl}/api/v1/collections/collections/today/collector`, httpOptions);
  }

  getCollectorAllocations() {
    return this.http.get(`${environment.apiUrl}/api/v1/float/get/allocations`, httpOptions);

  }
  getFarmerCollections(id: any) {
    return this.http.get(`${environment.apiUrl}/api/v1/collections/per/farmer?farmerId=` + id, httpOptions);
  }

  getFarmerDetails(id: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/v1/farmer/farmers/details?farmerId=` + id, httpOptions);
  }

  deleteFarmerDetails(id: any): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/api/v1/farmer/delete/` + id, httpOptions);
  }

  allocateFloatToCollector(data: any) {
    return this.http.post(`${environment.apiUrl}/api/v1/float/allocate`, data, httpOptions);
  }

  milkCollectionsPerCollectorInPerYear(year: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/v1/collections/analytics/year?year=` + year, httpOptions);
  }

  getFarmerAccruals(farmerId: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/v1/farmer/accruals?farmerId=` + farmerId, httpOptions);
  }

  getAllCollectors(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/v1/collections/analytics/roleUsers?roleId=2`, httpOptions);
  }

  getCollectorLocationsByDate(collectorId: any, date: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/v1/collections/collector/routes?collectorId=${collectorId}&date=${date}`, httpOptions);
  }


  getSales(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/v1/farmer/allocations/get`, httpOptions);
  }

  addAllocation(data: any) {
    return this.http.post(`${environment.apiUrl}/api/v1/farmers/allocation/add`, data, httpOptions);
  }


  getAllFarmers(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/v1/farmer/get`, httpOptions);
  }


  getAllProducts(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/v1/products/all`, httpOptions);
  }
}
