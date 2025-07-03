/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';


const routes: Route[] = [
    // { path: 'agenda-approve', loadChildren: () => import('app/modules/meeting/agenda-approve/agenda-approve.module').then(m => m.AgendaApproveModule) },
    { path: 'agenda-reserve', loadChildren: () => import('app/modules/meeting/agenda-reserve/agenda-reserve.module').then(m => m.AgendaReserveModule) },
    { path: 'new-agenda-reserve', loadChildren: () => import('app/modules/meeting/new-agenda-reserve/agenda-reserve.module').then(m => m.AgendaReserveModule) },
    { path: 'meeting-mgm', loadChildren: () => import('app/modules/meeting/meeting-mgm/meeting-mgm.module').then(m => m.MeetingMgmModule) },
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
export class MeetingModule { }
