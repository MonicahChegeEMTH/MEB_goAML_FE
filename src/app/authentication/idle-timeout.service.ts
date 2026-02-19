import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root',
})
export class IdleTimeoutService {
  private timeoutId: any;
  private readonly IDLE_TIME = 2 * 60 * 1000; // 2 minutes

  constructor(private router: Router, private ngZone: NgZone) {}

  startWatching() {
    this.resetTimer();

    const events = [
      'mousemove',
      'mousedown',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];

    events.forEach(event =>
      window.addEventListener(event, () => this.resetTimer())
    );
  }

  resetTimer() {
    clearTimeout(this.timeoutId);

    this.ngZone.runOutsideAngular(() => {
      this.timeoutId = setTimeout(() => {
        this.ngZone.run(() => this.logout());
      }, this.IDLE_TIME);
    });
  }

  logout() {
    console.warn('Session expired due to inactivity');

    // 🔥 CLEAR TOKEN HERE (no TokenStorageService)
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    this.router.navigate(['/authentication/signin']);
  }

  stopWatching() {
    clearTimeout(this.timeoutId);
  }
}
