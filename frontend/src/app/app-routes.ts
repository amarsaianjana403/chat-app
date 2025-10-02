import { Routes } from '@angular/router'

export const appRoutes: Routes = [

    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    // {
    //     path: 'login',
    //     loadComponent: () => import('').then(m => m.Login)

    // },
]