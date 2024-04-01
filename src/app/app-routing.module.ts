import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { AuthGuard } from './services/authentication.service';
import {AssetsComponent} from "./pages/assets_data/assets/assets.component";

const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/authentication',
        pathMatch: 'full',
      }, {
        path: 'ui-components',
        loadChildren: () =>
          import('./pages/ui-components/ui-components.module').then(
            (m) => m.UicomponentsModule
          ),
      }, {
        path: 'extra',
        canActivate: [AuthGuard], data: { roles: [1, 2, 3] },
        loadChildren: () =>
          import('./pages/extra/extra.module').then((m) => m.ExtraModule),
      }, {
        path: 'outbreaks',
        canActivate: [AuthGuard], data: { roles: [1, 2, 3] },
        loadChildren: () =>
          import('./pages/outbreaks/outbreaks.module').then((m) => m.OutbreaksModule),
      }, {
        path: 'cases',
        canActivate: [AuthGuard], data: { roles: [1, 2, 3] },
        loadChildren: () =>
          import('./pages/cases/cases.module').then((m) => m.CasesModule),
      }, {
        path: 'analytics',
        loadChildren: () =>
          import('./pages/analytics/analytics.module').then((m) => m.AnalyticsModule),
      }, {
        path: 'settings',
        canActivate: [AuthGuard], data: { roles: [1, 2] },
        loadChildren: () =>
          import('./pages/settings/settings.module').then((m) => m.SettingsModule),
      }, {
        path: 'users',
        canActivate: [AuthGuard], data: { roles: [1, 2, 3] },
        loadChildren: () =>
          import('./pages/users/users.module').then((m) => m.UsersModule),
      }, {
        path: 'fields',
        canActivate: [AuthGuard], data: { roles: [1, 2, 3] },
        loadChildren: () =>
          import('./pages/mfields/mfields.module').then((m) => m.MFieldsModule),
      }, {
        path: 'mfield_options',
        canActivate: [AuthGuard], data: { roles: [1, 2, 3] },
        loadChildren: () =>
          import('./pages/mfield_options/mfield_options.module').then((m) => m.MFieldOptionsModule),
      }, {
        path: 'syndromes',
        canActivate: [AuthGuard], data: { roles: [1, 2, 3] },
        loadChildren: () =>
          import('./pages/syndromes/syndromes.module').then((m) => m.SyndromesModule),
      }, {
        path: 'diseases',
        canActivate: [AuthGuard], data: { roles: [1, 2, 3] },
        loadChildren: () =>
          import('./pages/diseases/diseases.module').then((m) => m.DiseasesModule),
      }, {
        path: 'mforms',
        canActivate: [AuthGuard], data: { roles: [1, 2, 3] },
        loadChildren: () =>
          import('./pages/mforms/mforms.module').then((m) => m.MFormsModule),
      }, {
        path: 'mform_fields',
        canActivate: [AuthGuard], data: { roles: [1, 2, 3] },
        loadChildren: () =>
          import('./pages/mform_fields/mform_fields.module').then((m) => m.MFormFieldsModule),
      }, {
        path: 'mform_forms',
        canActivate: [AuthGuard], data: { roles: [1, 2, 3] },
        loadChildren: () =>
          import('./pages/mform_forms/mform_forms.module').then((m) => m.MFormFormsModule),
      }, {
        path: 'mform_data',
        canActivate: [AuthGuard], data: { roles: [1, 2, 3] },
        loadChildren: () =>
          import('./pages/mform_data/mform_data.module').then((m) => m.MFormDataModule),
      },{
        path: 'surveillance',
        // canActivate: [AuthGuard], data: { roles: [1, 2, 3, 'guest'] },
        loadChildren: () =>
          import('./pages/surveillance_data/surveillance_data.module').then((m) => m.Surveillance_dataModule),
      },{
        path: 'dashboard',
        // canActivate: [AuthGuard], data: { roles: [1, 2, 3] },
        loadChildren: () =>
          import('./pages/home/home.module').then((m) => m.HomeModule),
      },{
        path: 'home',
        // canActivate: [AuthGuard], data: { roles: [1, 2, 3] },
        loadChildren: () =>
          import('./pages/pages.module').then((m) => m.PagesModule),
      },
      {
        path: 'resources',
        // canActivate: [AuthGuard], data: { roles: [1, 2, 3] },
        loadChildren: () =>
          import('./pages/resources/resources.module').then((m) => m.ResourcesModule),
      },
      { path: 'assets/:fileName', component: AssetsComponent },
      {
        path: 'thresholds',
        canActivate: [AuthGuard], data: { roles: [1, 2, 3] },
        loadChildren: () =>
          import('./pages/thresholds/thresholds.module').then((m) => m.ThresholdsModule),
      },
      {
        path: 'mohdash',
        // canActivate: [AuthGuard], data: { roles: [1, 2, 3] },
        loadChildren: () =>
          import('./pages/mohdash/mohdash.module').then((m) => m.MohdashModule),
      }
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
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class AppRoutingModule { }
