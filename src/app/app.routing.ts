import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';
import { SigninResolver } from './modules/auth/sign-in/sign-in.resolvers';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    {path: '', pathMatch : 'full', redirectTo: 'dashboard'},
    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'dashboard'},

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'sign-in', resolve:[SigninResolver], loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule)},
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule)}
        ]
    },

    // Admin routes
    {
        path       : '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component  : LayoutComponent,
        resolve    : {
            initialData: InitialDataResolver,
        },
        children   : [
            {path: 'dashboard', loadChildren: () => import('app/modules/dashboard/dashboard.module').then(m => m.DashboardModule) },
            {path: 'calendar', loadChildren: () => import('app/modules/calendar/calendar.module').then(m => m.CalendarModule) },
            {path: 'configure', loadChildren: () => import('app/modules/configure/configure.module').then(m => m.ConfigureModule)},
            {path: 'member', loadChildren: () => import('app/modules/member/user.module').then(m => m.UserModule)},
            {path: 'meeting-config', loadChildren: () => import('app/modules/meeting-config/meeting-config.module').then(m => m.MeetingConfigModule)},
            {path: 'meeting', loadChildren: () => import('app/modules/meeting/meeting.module').then(m => m.MeetingModule)},
            {path: 'approver', loadChildren: () => import('app/modules/approver/approver.module').then(m => m.ApproverModule)},
            {path: 'document-template', loadChildren: () => import('app/modules/document-template/document-template.module').then(m => m.DocumentTemplateModule)},
            {path: 'log', loadChildren: () => import('app/modules/log/log.module').then(m => m.LogModule)},
        ]
    },
    {path: '**', pathMatch : 'full', redirectTo: 'sign-in'},
];
