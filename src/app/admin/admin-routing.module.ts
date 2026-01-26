import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/guard/auth.guard';
import { Role } from '../core/models/role';

const routes: Routes = [
  {
    path: 'dashboard',
     canActivate: [AuthGuard],
    loadChildren: () =>
      import('./dashboard/dashboard.module').then(
        (m) => m.AdminDashboardModule
      ),
  },

  {
    path: 'reports',
     canActivate: [AuthGuard],
     data: { roles: [Role.Admin] },
    loadChildren: () =>
      import('./reports/reports.module').then((m) => m.ReportsModule),
  },

  {
    path: 'logs',
     canActivate: [AuthGuard],
    loadChildren: () => import('./logs/logs.module').then((m) => m.LogsModule),
  },

  {
    path: 'user-profile',
     canActivate: [AuthGuard],
    loadChildren: () =>
      import('./users/users.module').then((m) => m.UsersModule),
  },
  {
    path: 'user-accounts',
     canActivate: [AuthGuard],
    loadChildren: () =>
      import('./users/users.module').then((m) => m.UsersModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
