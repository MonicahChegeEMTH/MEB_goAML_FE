import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {

  constructor(private http: HttpClient) { }

  bulkDeliveryUpload(data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/api/v1/collections/add/bulk`, data);
  }
}
