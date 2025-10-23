import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private getTenantHeaders(): HttpHeaders {
    return new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set(
        'Authorization',
        `Bearer ${localStorage.getItem('authToken') || ''}`
      );
  }

  private refreshWidgetsSubject = new BehaviorSubject<void>(null);
  refreshWidgets$ = this.refreshWidgetsSubject.asObservable();

  constructor(private http: HttpClient) {}

   triggerWidgetsRefresh() {
    this.refreshWidgetsSubject.next();
  }

  getUserDetails(userId): Observable<any> {
    const getUserDetailsUrl = `${environment.apiUrl}/admin/api/v1/users/${userId}`;

    return this.http.get<any>(getUserDetailsUrl, {
      headers: this.getTenantHeaders(),
    });
  }

  fetchAllActiveAccounts(): Observable<any> {
    const fetchAllActiveAccountsUrl = `${environment.apiUrl}/admin/api/v1/users/active-accounts`;

    return this.http.get<any>(fetchAllActiveAccountsUrl, {
      headers: this.getTenantHeaders(),
    });
  }

  fetchAllUserAccounts(): Observable<any> {
    const fetchAllUserAccountsUrl = `${environment.apiUrl}/admin/api/v1/users/all-accounts`;

    return this.http.get<any>(fetchAllUserAccountsUrl, {
      headers: this.getTenantHeaders(),
    });
  }
  getAllCollectors(): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/api/v1/collections/analytics/collectors`,
      { headers: this.getTenantHeaders() }
    );
  }

  createUserAccounts(user): Observable<any> {
    const createUserAccountsUrl = `${environment.apiUrl}/api/users/add`;

    return this.http.post<any>(createUserAccountsUrl, user, {
      headers: this.getTenantHeaders(),
    });
  }

  deleteUserAccount(userId: number, reason: string): Observable<any> {
    const deleteUserAccountUrl = `${environment.apiUrl}/admin/api/v1/users/delete-user/${userId}?userId=${userId}`;

    return this.http.put<any>(
      deleteUserAccountUrl,
      { reason },
      { headers: this.getTenantHeaders() }
    );
  }

  fetchAllDeletedUserAccounts(): Observable<any> {
    const fetchAllDeletedUserAccountsUrl = `${environment.apiUrl}/admin/api/v1/users/deleted-accounts`;

    return this.http.get<any>(fetchAllDeletedUserAccountsUrl, {
      headers: this.getTenantHeaders(),
    });
  }

  lockUserAccount(userId: number, reason: string): Observable<any> {
    const lockUserAccountUrl = `${environment.apiUrl}/admin/api/v1/users/lock-user/${userId}`;

    return this.http.put<any>(
      lockUserAccountUrl,
      { reason },
      { headers: this.getTenantHeaders() }
    );
  }

  fetchAllLockedUserAccounts(): Observable<any> {
    const fetchAllLockedUserAccountsUrl = `${environment.apiUrl}/admin/api/v1/users/locked-accounts`;

    return this.http.get<any>(fetchAllLockedUserAccountsUrl, {
      headers: this.getTenantHeaders(),
    });
  }

  restoreDeletedUserAccount(userId): Observable<any> {
    const restoreDeletedUserAccountUrl = `${environment.apiUrl}/admin/api/v1/users/restore-user/${userId}`;

    return this.http.put<any>(
      restoreDeletedUserAccountUrl,
      {},
      { headers: this.getTenantHeaders() }
    );
  }

  unlockUserAccount(userId: number, reason: string): Observable<any> {
  const unlockUserAccountUrl = `${environment.apiUrl}/admin/api/v1/users/unlock-user/${userId}?userId=${userId}`;

  return this.http.put<any>(
    unlockUserAccountUrl,
    { reason },
    { headers: this.getTenantHeaders() }
  );
}


  updateUserPassword(passwordDetails): Observable<any> {
    const updateUserPasswordUrl = `${environment.apiUrl}/admin/api/v1/users/update-user-password`;

    return this.http.put<any>(updateUserPasswordUrl, passwordDetails, {
      headers: this.getTenantHeaders(),
    });
  }

  updateUserRole(roleDetails): Observable<any> {
    const updateUserRoleUrl = `${environment.apiUrl}/admin/api/v1/users/update-user-role`;

    return this.http.put<any>(updateUserRoleUrl, roleDetails, {
      headers: this.getTenantHeaders(),
    });
  }

  updateUser(userId, user): Observable<any> {
    const updateUserUrl = `${environment.apiUrl}/admin/api/v1/users/update-user/${userId}`;

    return this.http.put<any>(updateUserUrl, user, {
      headers: this.getTenantHeaders(),
    });
  }

  private handleError(operation: string, error: any): Observable<never> {
    const backendMsg =
      error?.error?.message ||
      error?.error?.error ||
      error?.message ||
      'Unknown error';

    console.error(`Error ${operation}:`, error);

    return throwError(() => ({
      ...error,
      friendlyMessage: `${operation}: ${backendMsg}`,
    }));
  }
}
