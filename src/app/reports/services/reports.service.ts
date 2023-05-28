import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(private http: HttpClient) { }



  generatefarmerCollections(farmerN0: any): Observable<any> {
    let headers = new HttpHeaders();
    headers.append("Accept", "application/pdf");

    let requestOptions: any = {
      params: farmerN0,
      headers: headers,
      responseType: "blob",
      withCredentials: false,
    };
    let API_URL = `${environment.apiUrl}/api/v1/reports/farmer/collections?farmerNo=` + farmerN0;

    return this.http.get(API_URL, requestOptions).pipe(
      map((response) => {
        return {
          filename: "FarmerCollections",
          data: new Blob([response], { type: "application/pdf" }),
        };
      })
    );
  }
  generatefarmerProducts(farmerN0: any, month: any): Observable<any> {
    let headers = new HttpHeaders();
    headers.append("Accept", "application/pdf");

    let requestOptions: any = {
      params: farmerN0, month,
      headers: headers,
      responseType: "blob",
      withCredentials: false,
    };
    let API_URL = `${environment.apiUrl}/api/v1/reports/farmer/product/allocations?farmer_no=` + farmerN0 + `&month=` + month;

    return this.http.get(API_URL, requestOptions).pipe(
      map((response) => {
        return {
          filename: "FarmerCollections",
          data: new Blob([response], { type: "application/pdf" }),
        };
      })
    );
  }
  generatefarmerStatement(farmerNo: any, from: any, to: any): Observable<any> {
    console.log("Calling api  ....")
    let headers = new HttpHeaders();
    headers.append("Accept", "application/pdf");

    let requestOptions: any = {
      params: farmerNo, from, to,
      headers: headers,
      responseType: "blob",
      withCredentials: false,
    };
    let API_URL = `${environment.apiUrl}/api/v1/reports/farmer/statement?farmerNo=` + farmerNo + `&from=` + from + `&to=` + to;
    console.log("API== " + API_URL)

    return this.http.get(API_URL, requestOptions).pipe(
      map((response) => {
        return {
          filename: "FarmerStatement",
          data: new Blob([response], { type: "application/pdf" }),
        };
      })
    );
  }
  collectionsPerDate(date: any): Observable<any> {
    let headers = new HttpHeaders();
    headers.append("Accept", "application/pdf");

    let requestOptions: any = {
      params: date,
      headers: headers,
      responseType: "blob",
      withCredentials: false,
    };
    let API_URL = `${environment.apiUrl}/api/v1/reports/date?date=` + date;

    return this.http.get(API_URL, requestOptions).pipe(
      map((response) => {
        return {
          filename: "CollectionsPerDate",
          data: new Blob([response], { type: "application/pdf" }),
        };
      })
    );
  }
  collectionsPerDateExcel(date: string): Observable<any> {
    let headers = new HttpHeaders();
    headers.append("Accept", 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    let API_URL = `${environment.apiUrl}/api/v1/excel/reports/collectionsPerDate?date=` + date;
    console.log("Calling api " + API_URL)

    return this.http.get(API_URL, { headers, responseType: 'blob' });
  }
  collectionsPerMCCandDateExcel(pid:any,date: string): Observable<any> {
    let headers = new HttpHeaders();
    headers.append("Accept", 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    let API_URL = `${environment.apiUrl}/api/v1/excel/reports/collections/pickuplocation?pid=`+pid+`&date=` + date;
    console.log("Calling api " + API_URL)

    return this.http.get(API_URL, { headers, responseType: 'blob' });
  }


  collectionsPerCollectorByDate(date: any): Observable<any> {
    let headers = new HttpHeaders();
    headers.append("Accept", "application/pdf");

    let requestOptions: any = {
      params: date,
      headers: headers,
      responseType: "blob",
      withCredentials: false,
    };
    let API_URL = `${environment.apiUrl}/api/v1/reports/percollectors?date=` + date;

    return this.http.get(API_URL, requestOptions).pipe(
      map((response) => {
        return {
          filename: "CollectionsPerCollectors",
          data: new Blob([response], { type: "application/pdf" }),
        };
      })
    );
  }
  collectionsPerPulByDate(locationId: any, date: any): Observable<any> {
    let headers = new HttpHeaders();
    headers.append("Accept", "application/pdf");

    let requestOptions: any = {
      params: locationId, date,
      headers: headers,
      responseType: "blob",
      withCredentials: false,
    };
    let API_URL = `${environment.apiUrl}/api/v1/reports/collections/per/pickUpLocation?pickUpLocationId=` + locationId + `&date=` + date;

    console.log("Calling api == " + API_URL)

    return this.http.get(API_URL, requestOptions).pipe(
      map((response) => {
        return {
          filename: "CollectionsPerCollectors",
          data: new Blob([response], { type: "application/pdf" }),
        };
      })
    );
  }


  collectionsPerLocationrByDate(date: any): Observable<any> {
    let headers = new HttpHeaders();
    headers.append("Accept", "application/pdf");

    let requestOptions: any = {
      params: date,
      headers: headers,
      responseType: "blob",
      withCredentials: false,
    };
    let API_URL = `${environment.apiUrl}/api/v1/reports/perlocations?date=` + date;

    return this.http.get(API_URL, requestOptions).pipe(
      map((response) => {
        return {
          filename: "TotalCollectionsPerRoute",
          data: new Blob([response], { type: "application/pdf" }),
        };
      })
    );
  }
  collectionsPerLocationrByDatep(date: any): Observable<any> {
    let headers = new HttpHeaders();
    headers.append("Accept", "application/pdf");

    let requestOptions: any = {
      params: date,
      headers: headers,
      responseType: "blob",
      withCredentials: false,
    };
    let API_URL = `${environment.apiUrl}/api/v1/reports/collections/pickuplocations/date?date=` + date;

    return this.http.get(API_URL, requestOptions).pipe(
      map((response) => {
        return {
          filename: "TotalCollectionsPerLocation",
          data: new Blob([response], { type: "application/pdf" }),
        };
      })
    );
  }
  collectionsPerLocationrByMonth(month: any): Observable<any> {
    let headers = new HttpHeaders();
    headers.append("Accept", "application/pdf");

    let requestOptions: any = {
      params: month,
      headers: headers,
      responseType: "blob",
      withCredentials: false,
    };
    let API_URL = `${environment.apiUrl}/api/v1/reports/collections/pickuplocations/month?month=` + month;

    return this.http.get(API_URL, requestOptions).pipe(
      map((response) => {
        return {
          filename: "TotalCollectionsPerLocation",
          data: new Blob([response], { type: "application/pdf" }),
        };
      })
    );
  }
  getPaymentFile(locationId:any,month: any, mode: any): Observable<any> {
    console.log("..Calling api  ....")
    let headers = new HttpHeaders();
    headers.append("Accept", "application/pdf");

    let requestOptions: any = {
      params: month, mode,
      headers: headers,
      responseType: "blob",
      withCredentials: false,
    };
    let API_URL = `${environment.apiUrl}/api/v1/reports/paymentfile?pickupLocationId=`+locationId+`&month=` + month + `&paymentMode=` + mode;
    console.log("Calling api"+ API_URL)

    return this.http.get(API_URL, requestOptions).pipe(
      map((response) => {
        return {
          filename: month + "-PaymentFile",
          data: new Blob([response], { type: "application/pdf" }),
        };
      })
    );
  }

}
