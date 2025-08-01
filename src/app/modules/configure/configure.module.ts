/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';


const routes: Route[] = [
    {path: 'mail-server', loadChildren: () => import('app/modules/configure/mail-server/mail-server.module').then(m => m.MailServerModule)},
    {path: 'application-config', loadChildren: () => import('app/modules/configure/application/application.module').then(m => m.ApplicationModule)}
];

@NgModule({
    declarations: [

    ],
    imports: [
        RouterModule.forChild(routes),
        SharedModule,
        NgxMatSelectSearchModule
    ]
})
export class ConfigureModule {}
