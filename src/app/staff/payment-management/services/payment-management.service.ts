import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface PaymentMode {
  id: number;
  name: string;
}

export interface BankOption {
  id: number;
  code: string;
  name: string;
  description?: string;
  active: boolean;
  categoryName: string;
  categoryId?: number;
  createdOn: string;
}

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class PaymentManagementService {
  private apiUrl = `${environment.apiUrl}/api/v1/payments`;

  constructor(private http: HttpClient) {}

  getPaymentModes(): Observable<PaymentMode[]> {
    return this.http.get<PaymentMode[]>(`${this.apiUrl}/mode`, httpOptions);
  }

  addPaymentMode(mode: PaymentMode): Observable<any> {
    return this.http.post(`${this.apiUrl}/mode`, mode, httpOptions);
  }

  updatePaymentMode(mode: PaymentMode): Observable<any> {
    return this.http.put(`${this.apiUrl}/mode/${mode.id}`, mode, httpOptions);
  }

  deletePaymentMode(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/mode/soft-delete/${id}`, httpOptions);
  }

  getPaymentOptions(): Observable<BankOption[]> {
    return this.http.get<BankOption[]>(`${this.apiUrl}/options`, httpOptions);
  }

  addPaymentOption(option: BankOption): Observable<any> {
    return this.http.post(`${this.apiUrl}/options`, option, httpOptions);
  }

  updatePaymentOption(option: BankOption): Observable<any> {
    return this.http.put(`${this.apiUrl}/options/${option.id}`, option, httpOptions);
  }

  deletePaymentOption(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/options/soft-delete/${id}`, httpOptions);
  }
}
