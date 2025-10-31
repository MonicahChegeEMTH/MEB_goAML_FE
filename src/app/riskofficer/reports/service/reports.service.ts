import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  private apiUrl = `${environment.apiUrl}/api/users/audit/logs`;
  
    constructor(private http: HttpClient) {}
  
    getAuditLogs(): Observable<any[]> {
      return this.http.get<any[]>(this.apiUrl, {});
    }
}
