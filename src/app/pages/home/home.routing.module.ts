import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';

export const HomePageRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      title: 'Home Page',
    },
  },
];
