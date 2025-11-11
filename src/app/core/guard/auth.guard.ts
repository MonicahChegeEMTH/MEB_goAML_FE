import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";

import { AuthService } from "../service/auth.service";
import { TokenStorageService } from "../service/token-storage.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private tokenStorage: TokenStorageService) {}

//   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
//   console.log('AuthGuard triggered for', state.url);
//   const user = this.tokenStorage.getUser();
//   console.log('User from storage:', user);

//   if (user) {
//     const userRole = user.roles[0]?.name;
//     console.log('User role:', userRole);
//     const allowedRoles = Array.isArray(route.data.role) ? route.data.role : [route.data.role];
//     console.log('Allowed roles:', allowedRoles);

//     if (route.data.role && !allowedRoles.includes(userRole)) {
//       console.log('Role mismatch, redirecting to signin');
//       this.router.navigate(['/authentication/signin']);
//       return false;
//     }
//     return true;
//   }

//   console.log('No user found in storage, redirecting to signin');
//   this.router.navigate(['/authentication/signin']);
//   return false;
// }

canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  console.log('AuthGuard triggered for', state.url);
  const user = this.tokenStorage.getUser();
  console.log('User from storage:', user);

  if (!user) {
    console.log('No user found in storage, redirecting to signin');
    this.router.navigate(['/authentication/signin']);
    return false;
  }

  const userRole = user.roles[0]?.name;
  console.log('User role:', userRole);

  const allowedRoles = Array.isArray(route.data?.roles) ? route.data.roles : (route.data?.roles ? [route.data.roles] : []);
  console.log('Allowed roles:', allowedRoles);

  // Only block if allowedRoles is non-empty
  if (allowedRoles.length && !allowedRoles.includes(userRole)) {
    console.log('Role mismatch, redirecting to signin');
    this.router.navigate(['/authentication/signin']);
    return false;
  }

  return true;
}




}
