/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';


const routes: Route[] = [
    { path: 'agenda-approve', loadChildren: () => import('app/modules/approver/agenda-approve/agenda-approve.module').then(m => m.AgendaApproveModule) },
    { path: 'minute-approve', loadChildren: () => import('app/modules/approver/minute-approve/minute-approve.module').then(m => m.MinuteApproveModule) },
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
export class ApproverModule { }
