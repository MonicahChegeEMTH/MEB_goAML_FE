import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SmsService {
  constructor(private http: HttpClient) { }

  getAllSMS(): Observable<any> {
    const url = `${environment.apiUrl}/api/v1/sms/notifications`;
    return this.http.get<any>(url)
  }

  sendSMS(phoneNo: any, message: any): Observable<any> {
    const url = `${environment.apiUrl}/api/v1/sms/sendSMS?message=${message}&phone=${phoneNo}`;
    return this.http.post<any>(url, {})
  }
}
