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
    return this.http.get<any[]>(
      `${environment.apiUrl}/api/users/audit/logs`,
      {}
    );
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
    return this.http.get(
      `${environment.apiUrl}/api/reports/downloadZip/${id}`,
      {
        responseType: 'blob' as 'blob',
      }
    );
  }

  updateReport(id: string, xmlContent: string): Observable<any> {
    return this.http.put<any>(
      `${environment.apiUrl}/api/reports/report/${id}/updateXml`,
      xmlContent
    );
  }

  reportCount() {
    return this.http.get<{ totalReports: number; message: string }>(
      `${environment.apiUrl}/api/reports/reports/count`
    );
  }

  getAccounts(docCode: string, referenceNumber: string) {
    return this.http.get<any[]>(
      `${environment.apiUrl}/api/reports/allAccounts`,
      {
        params: { doccode: docCode, referencenumber: referenceNumber },
      }
    );
  }

  getIndicators(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/sar/indicators`);
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

    return this.http.post(
      `${environment.apiUrl}/api/reports/sar`,
      {},
      { params }
    );
  }

  downloadStrReport(
    tranIds: string[],
    tranDates: string[],
    reason: string,
    action: string,
    comments: string,
    indicators: string[]
  ): Observable<any> {
    let params = new HttpParams();

    tranIds.forEach((id) => {
      params = params.append('tranId', id);
    });

    tranDates.forEach((date) => {
      params = params.append('tranDate', date);
    });

    if (indicators) {
      indicators.forEach((ind) => {
        params = params.append('indicators', ind);
      });
    }

    if (reason) params = params.append('reason', reason);
    if (action) params = params.append('action', action);
    if (comments) params = params.append('comments', comments);

    return this.http.post(
      `${environment.apiUrl}/api/reports/str`,
      {},
      { params }
    );
  }

  downloadStarReport(
    tranIds: string[],
    tranDates: string[],
    reason: string,
    action: string,
    comments: string,
    indicators: string[]
  ): Observable<any> {
    let params = new HttpParams();

    tranIds.forEach((id) => {
      params = params.append('tranId', id);
    });

    tranDates.forEach((date) => {
      params = params.append('tranDate', date);
    });

    if (indicators) {
      indicators.forEach((ind) => {
        params = params.append('indicators', ind);
      });
    }

    if (reason) params = params.append('reason', reason);
    if (action) params = params.append('action', action);
    if (comments) params = params.append('comments', comments);

    return this.http.post(
      `${environment.apiUrl}/api/reports/star`,
      {},
      { params }
    );
  }

  downloadCtrReport(tranIds: string[], tranDates: string[]): Observable<any> {
    let params = new HttpParams();

    tranIds.forEach((id) => {
      params = params.append('tranId', id);
    });

    tranDates.forEach((date) => {
      params = params.append('tranDate', date);
    });

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

  createManualSar(
    sarDataArray: {
      reason: string;
      action: string;
      firstName: string;
      lastName: string;
      birthdate?: string;
      occupation?: string;
      idNumber: string;
      nationality1?: string;
      indicator: string;
    }[]
  ): Observable<any> {
    return this.http.post<
      { fileName: string; id: string; xmlContent: string }[]
    >(`${environment.apiUrl}/api/sar/manualSAR`, sarDataArray);
  }

  createEntityManualSar(
    sarDataArray: {
      reason: string;
      action: string;
      firstName: string;
      lastName: string;
      birthdate?: string;
      occupation?: string;
      idNumber: string;
      nationality1?: string;
      indicator: string;
      name: string;
      regNumber: string;
      business: string;
      countryCode: string;
    }[]
  ): Observable<any> {
    return this.http.post<
      { fileName: string; id: string; xmlContent: string }[]
    >(`${environment.apiUrl}/api/sar/manualEntitySAR`, sarDataArray);
  }

  getReportBySwiftRef(swiftRef: string): Observable<any> {
  return this.http.get<any>(
    `${environment.apiUrl}/api/reports/tran-id/${swiftRef}`
  );
}
}
