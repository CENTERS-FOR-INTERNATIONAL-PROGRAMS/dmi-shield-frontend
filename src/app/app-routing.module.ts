import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { AuthGuard } from './services/authentication.service';
import { AssetsComponent } from './pages/assets_data/assets/assets.component';

const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/authentication',
        pathMatch: 'full',
      },
      {
        path: 'outbreaks',
        canActivate: [AuthGuard],
        data: { roles: [1, 2, 3] },
        loadChildren: () =>
          import('./pages/outbreaks/outbreaks.module').then(
            (m) => m.OutbreaksModule
          ),
      },
      {
        path: 'cases',
        canActivate: [AuthGuard],
        data: { roles: [1, 2, 3] },
        loadChildren: () =>
          import('./pages/cases/cases.module').then((m) => m.CasesModule),
      },
      {
        path: 'analytics',
        loadChildren: () =>
          import('./pages/analytics/analytics.module').then(
            (m) => m.AnalyticsModule
          ),
      },
      {
        path: 'settings',
        canActivate: [AuthGuard],
        data: { roles: ['admin'] },
        loadChildren: () =>
          import('./pages/settings/settings.module').then(
            (m) => m.SettingsModule
          ),
      },
      {
        path: 'users',
        canActivate: [AuthGuard],
        data: { roles: ['level1', 'level2', 'admin', 'guest'] },
        loadChildren: () =>
          import('./pages/users/users.module').then((m) => m.UsersModule),
      },
      {
        path: 'surveillance',
        loadChildren: () =>
          import('./pages/surveillance_data/surveillance_data.module').then(
            (m) => m.Surveillance_dataModule
          ),
      },
      {
        path: 'home',
        loadChildren: () =>
          import('./pages/pages.module').then((m) => m.PagesModule),
      },
      {
        path: 'resources',
        loadChildren: () =>
          import('./pages/resources/resources.module').then(
            (m) => m.ResourcesModule
          ),
      },
      { path: 'assets/:fileName', component: AssetsComponent },
      {
        path: 'mohdash',
        loadChildren: () =>
          import('./pages/mohdash/mohdash.module').then((m) => m.MohdashModule),
      },
      {
        path: 'about',
        loadChildren: () =>
          import('./pages/about/about.module').then((m) => m.AboutModule),
      },
      {
        path: 'dashboards',
        loadChildren: () =>
          import('./pages/dashboards/dashboards.module').then(
            (m) => m.DashboardsModule
          ),
      },
      {
        path: 'notifications',
        loadChildren: () =>
          import('./pages/notifications/notifications.module').then(
            (m) => m.NotificationsModule
          ),
      },
      {
        path: 'support',
        loadChildren: () =>
          import('./pages/support/support.module').then((m) => m.SupportModule),
      },

      {
        path: 'thresholds',
        loadChildren: () =>
          import('./pages/thresholds/thresholds.module').then(
            (m) => m.ThresholdsModule
          ),
      },
    ],
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.module').then(
            (m) => m.AuthenticationModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
