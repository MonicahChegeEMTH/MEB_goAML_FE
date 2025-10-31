import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private apiUrl = `${environment.apiUrl}/api/users/audit/logs`;
  private baseUrl = `${environment.apiUrl}/api/reports`;

  constructor(private http: HttpClient) {}

  getAuditLogs(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {});
  }

  getAllReports(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/reports/allreports`)
  }

 downloadReport(id: string): Observable<Blob> {
  return this.http.get(`${environment.apiUrl}/api/reports/download/${id}`, {
    responseType: 'blob' as 'blob', // important for file downloads
  });
}


  downloadSARReport(
    accountNumber: string,
    reason: string,
    action: string,
    indicators: string[]
  ): Observable<any> {
    const params = new HttpParams()
      .set('accountNumber', accountNumber)
      .set('reason', reason)
      .set('action', action)
      .set('indicators', indicators.join(','));

    return this.http.post(`${this.baseUrl}/sar`, {}, { params });
  }
}
