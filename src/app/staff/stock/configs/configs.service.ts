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

  url = `${environment.API}/api/v1/product/configuration/`;
  pricesUrl = `${environment.API}/api/v1/product-prices/`;

  public getConfigs(): Observable<any> {
    return this.http.get<any>(this.url + 'get');
  }

  public getProductPrices(): Observable<any> {
    return this.http.get<any>(this.pricesUrl + 'all');
  }

  public getConfigsById(productId:any): Observable<any> {
    return this.http.get<any>(this.url + 'id?productconfigId='+productId);
  }

  addNewConfiguration(data: any): Observable<any> {
    return this.http.post(this.url + 'add', data, httpOptions);
  }

  createProductPrice(productId: any, locationId: any, sellingPrice: any, effectiveFrom: any) {
    return this.http.post(this.pricesUrl+ `create/`+`${productId}/${locationId}?sellingPrice=${sellingPrice}&effectiveFrom=${effectiveFrom}`, {}, httpOptions);
  }

  updateConfiguration(data: any): Observable<any> {
    return this.http.put(this.url + 'update', data, httpOptions);
  }

  deleteConfiguration(id: any): Observable<any> {
    return this.http.delete(this.url + `delete/` + id, httpOptions);
  }

  getRoutes(): Observable<any> {
    return this.http.get<any>(`${environment.API}/api/v1/routes/get`, httpOptions);
  }

  getTransporters(): Observable<any>{
    return this.http.get(`${environment.apiUrl}/api/v1/users/by-role/5`);
  }
}
