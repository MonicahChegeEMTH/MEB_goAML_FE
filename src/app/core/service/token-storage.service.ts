import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const REFRESH_TOKEN_KEY = 'refresh-token';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  constructor() {}

  private setCookie(name: string, value: string, days = 1): void {
    const expires = new Date();
    expires.setDate(expires.getDate() + days);
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Strict;Secure`;
  }

  private getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }

  private deleteCookie(name: string): void {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }

  signOut(): void {
    this.deleteCookie(TOKEN_KEY);
    this.deleteCookie(REFRESH_TOKEN_KEY);
    this.deleteCookie(USER_KEY);
  }

  public saveToken(token: string, refreshToken: string): void {
    this.setCookie(TOKEN_KEY, token);
    this.setCookie(REFRESH_TOKEN_KEY, refreshToken);
  }

  public getToken(): string | null {
    return this.getCookie(TOKEN_KEY);
  }

  public getRefreshToken(): string | null {
    return this.getCookie(REFRESH_TOKEN_KEY);
  }

  public saveUser(user: any): void {
    this.setCookie(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = this.getCookie(USER_KEY);
    if (user) {
      try {
        return JSON.parse(user);
      } catch {
        return {};
      }
    }
    return {};
  }
}
