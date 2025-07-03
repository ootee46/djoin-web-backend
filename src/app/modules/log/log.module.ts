/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';;


const routes: Route[] = [
    {path: 'login', loadChildren: () => import('app/modules/log/login/login-log.module').then(m => m.LoginLogModule)},
    {path: 'fail-login', loadChildren: () => import('app/modules/log/fail-login/fail-login-log.module').then(m => m.FailLoginLogModule)},
    {path: 'error', loadChildren: () => import('app/modules/log/error/error-log.module').then(m => m.ErrorLogModule)},
    {path: 'mail', loadChildren: () => import('app/modules/log/mail/mail-log.module').then(m => m.MailLogModule)},
];

@NgModule({
    declarations: [

    ],
    imports: [
        RouterModule.forChild(routes),
        SharedModule
    ]
})
export class LogModule {}
