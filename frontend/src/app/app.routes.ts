import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: 'login',
        loadComponent: () => import('./components/auth/login/login.component').then((c) => c.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./components/auth/register/register.component').then((c)=> c.RegisterComponent)
    },
    {
        path: 'profile',
        loadComponent: ()=> import('./components/user-info/profile.component').then((c)=> c.ProfileComponent)
    },
    {
        path: 'qr-code',
        loadComponent: () => import('./components/app-qr/app-qr.component').then((c) => c.AppQrComponent)
    }
];
