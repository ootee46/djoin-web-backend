/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';;


const routes: Route[] = [
    {path: 'meeting-room', loadChildren: () => import('app/modules/meeting-config/meeting-room/meeting-room.module').then(m => m.MeetingRoomModule)},
    {path: 'meeting-type', loadChildren: () => import('app/modules/meeting-config/meeting-type/meeting-type.module').then(m => m.MeetingTypeModule)},
    {path: 'document-template-mgm', loadChildren: () => import('app/modules/meeting-config/document-template-mgm/document-template-mgm.module').then(m => m.DocumentTemplateMgmModule)},
    {path: 'document-type', loadChildren: () => import('app/modules/meeting-config/document-type/document-type.module').then(m => m.DocumentTypeModule)},
    {path: 'agenda-objective', loadChildren: () => import('app/modules/meeting-config/agenda-objective/agenda-objective.module').then(m => m.AgendaObjectiveModule)},
    {path: 'agenda-confidential', loadChildren: () => import('app/modules/meeting-config/agenda-confidential/agenda-confidential.module').then(m => m.AgendaConfidentialModule)},
    {path: 'agenda-approver-flow', loadChildren: () => import('app/modules/meeting-config/agenda-approver-flow/agenda-approver-flow.module').then(m => m.AgendaApproverFlowModule)},
    {path: 'approver-position', loadChildren: () => import('app/modules/meeting-config/approver-position/approver-position.module').then(m => m.ApproverPositionModule)},
    {path: 'approver-group', loadChildren: () => import('app/modules/meeting-config/approver-group/approver-group.module').then(m => m.ApproverGroupModule)},
    {path: 'approver-step', loadChildren: () => import('app/modules/meeting-config/approver-step/approver-step.module').then(m => m.ApproverStepModule)},
    {path: 'approver-config', loadChildren: () => import('app/modules/meeting-config/approver-config/approver-config.module').then(m => m.ApproverConfigModule)},
    {path: 'venue', loadChildren: () => import('app/modules/meeting-config/venue/venue.module').then(m => m.VenueModule)},
];

@NgModule({
    declarations: [

    ],
    imports: [
        RouterModule.forChild(routes),
        SharedModule
    ]
})
export class MeetingConfigModule {}
