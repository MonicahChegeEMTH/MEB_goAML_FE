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
  public getAllFarmers(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/v1/farmer/get`,httpOptions);
  }
  public getDateCollections(date:any): Observable<any> {
    console.log("Calling api..")
    return this.http.get(`${environment.apiUrl}/api/v1/collections/day/records?date=`+date,httpOptions);
  }

  public getDateDangeCollections(from:any,to:any): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/v1/collections/date/range/records?fromdate=`+from+`&&toDate=`+to,httpOptions);
  }

  public getPickUpLocationCollections(pickUpLocationId:any): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/v1/collections/record/pickupLocations?pickUpLocation=`+pickUpLocationId,httpOptions);
  }
  public getRouteCollections(routeId:any): Observable<any> {
    console.log("Calling api route d=id ,"+ routeId)
    return this.http.get(`${environment.apiUrl}/api/v1/collections/records/route?routeId=`+routeId,httpOptions);
  }

  public getAllCollectionsRecords(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/v1/collections/records/all`,httpOptions);
  }
  
  

  // public getDashboardWigetsAnalytics(): Observable<any> {
  //   return this.http.get(`${environment.apiUrl}api/v1/collections/collections/today`,httpOptions);
  // }

  // public getUsersPerRole(): Observable<any> {
  //   return this.http.get(`${environment.apiUrl}api/v1/collections/collections/today`,httpOptions);
  // }

 
}
