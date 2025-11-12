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
    return this.http.get<any[]>(`${environment.apiUrl}/api/users/audit/logs`, {});
  }

  getAllReports(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/reports/allreports`);
  }

  downloadReport(id: string): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/api/reports/download/${id}`, {
      responseType: 'blob' as 'blob',
    });
  }

  downloadZipReport(id: string): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/api/reports/downloadZip/${id}`, {
      responseType: 'blob' as 'blob',
    });
  }

  updateReport(id: string, xmlContent: string): Observable<any> {
    return this.http.put<any>(
      `${environment.apiUrl}/api/reports/report/${id}/updateXml`,
      xmlContent,
    );
  }

  reportCount() {
    return this.http.get<{ totalReports: number; message: string }>(
      `${environment.apiUrl}/api/reports/reports/count`
    );
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

    return this.http.post(`${environment.apiUrl}/api/reports/sar`, {}, { params });
  }

  downloadStrReport(
    trandId: string,
    tranDate: string,
    // accountNumber: string,
    reason: string,
    action: string,
    comments: string,
    indicators: string[]
  ): Observable<any> {
    const params = new HttpParams()
      .set('tranId', trandId)
      .set('tranDate', tranDate)
      // .set('accountNumber', accountNumber)
      .set('reason', reason)
      .set('action', action)
      .set('comments', comments)
      .set('indicators', indicators.join(','));

    return this.http.post(
      `${environment.apiUrl}/api/reports/str`,
      {},
      { params }
    );
  }

  downloadStarReport(
    trandId: string,
    tranDate: string,
    reason: string,
    action: string,
    comments: string,
    indicators: string[]
  ): Observable<any> {
    const params = new HttpParams()
      .set('tranId', trandId)
      .set('tranDate', tranDate)
      .set('reason', reason)
      .set('action', action)
      .set('comments', comments)
      .set('indicators', indicators.join(','));

    return this.http.post(
      `${environment.apiUrl}/api/reports/star`,
      {},
      { params }
    );
  }

  downloadCtrReport(
    tranType: string,
    trandId: string,
    tranDate: string
  ): Observable<any> {
    const params = new HttpParams()
      .set('tranType', tranType)
      .set('tranId', trandId)
      .set('tranDate', tranDate);
    return this.http.post(
      `${environment.apiUrl}/api/reports/ctr`,
      {},
      { params }
    );
  }

  downloadAccStmt(account: string, from: string, to: string): Observable<any> {
    const params = new HttpParams()
      .set('account', account)
      .set('from', from)
      .set('to', to);

    return this.http.get(
      `${environment.apiUrl}/api/reports/accountStatement`,
      
      { params }
    );
  }
}
