import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Home } from './pages/home/home';
import { MainLayout } from './layout/main-layout/main-layout';

export const routes: Routes = [
  { path: '', component: Login, pathMatch: 'full' },
  { path: 'register', component: Register },

  { path: '', component: MainLayout, children: [{ path: 'home', component: Home }] },
  { path: '**', redirectTo: '' },
];
