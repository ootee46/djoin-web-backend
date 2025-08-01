import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AttachmentModule } from '@oot/attachment/attachment.module';
import { DateInputModule } from '@oot/date-input/date-input.module';
import { FileInputModule } from '@oot/file-input/file-input.module';
import { SearchOptionModule } from '@oot/search-option/search-option.module';
import { SelectSearchModule } from '@oot/select-search/select-search.module';
import { TextSuggestionModule } from '@oot/text-suggestion/text-suggestion.module';
import { encryptStorage } from 'app/constants/constant';
import { ENDPOINT } from 'app/constants/endpoint';
import { SharedModule } from 'app/shared/shared.module';
import { NgxMaskModule } from 'ngx-mask';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { MeetingMgmResolver } from '../meeting-mgm.resolvers';
import { AgendaMinuteModule } from './agenda-minute/agenda-minute.module';
import { AgendaReservationModule } from './agenda-reservation/agenda-reservation.module';
import { AgendaModule } from './agenda/agenda.module';
import { AttendeeModule } from './attendee/attendee.module';
import { DocumentUploadModule } from './document-upload/document-upload.module';
import { MeetingMgmEditComponent } from './edit.component';
import { MeetingEditResolver } from './edit.resolvers';
import { FileOpenModule } from './file-open/file-open.module';
import { FollowUpModule } from './follow-up/follow-up.module';
import { InvitationModule } from './invitation/invitation.module';
import { JoinResultModule } from './join-result/join-result.module';
import { MinuteModule } from './minute/minute.module';
import { OverviewComponent } from './overview/overview.component';
import { VoteResultModule } from './vote-result/vote-result.module';

const routes: Route[] = [
    {path: ':id', pathMatch : 'full', redirectTo: 'overview/:id'},
    {
        path: 'overview/:id',
        resolve: [MeetingMgmResolver,MeetingEditResolver],
        component: MeetingMgmEditComponent
    },
    {
        path: 'attendee/:id',
        resolve: [MeetingMgmResolver,MeetingEditResolver],
        component: MeetingMgmEditComponent
    },
    {
        path: 'agenda/:id',
        resolve: [MeetingMgmResolver,MeetingEditResolver],
        component: MeetingMgmEditComponent
    },
    {
        path: 'reserve/:id',
        resolve: [MeetingMgmResolver,MeetingEditResolver],
        component: MeetingMgmEditComponent
    },
    {
        path: 'agenda-minute/:id/:requestId',
        resolve: [MeetingMgmResolver,MeetingEditResolver],
        component: MeetingMgmEditComponent
    },
    {
        path: 'agenda-minute/:id',
        resolve: [MeetingMgmResolver,MeetingEditResolver],
        component: MeetingMgmEditComponent
    },
    {
        path: 'minute/:id',
        resolve: [MeetingMgmResolver,MeetingEditResolver],
        component: MeetingMgmEditComponent
    },
    {
        path: 'invitation/:id',
        resolve: [MeetingMgmResolver,MeetingEditResolver],
        component: MeetingMgmEditComponent
    },
    {
        path: 'join/:id',
        resolve: [MeetingMgmResolver,MeetingEditResolver],
        component: MeetingMgmEditComponent
    },
    {
        path: 'follow/:id',
        resolve: [MeetingMgmResolver,MeetingEditResolver],
        component: MeetingMgmEditComponent
    },
    {
        path: 'vote/:id',
        resolve: [MeetingMgmResolver,MeetingEditResolver],
        component: MeetingMgmEditComponent
    },
    {
        path: 'file/:id',
        resolve: [MeetingMgmResolver,MeetingEditResolver],
        component: MeetingMgmEditComponent
    }
];

@NgModule({
    declarations: [
        MeetingMgmEditComponent
        , OverviewComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        AttachmentModule.forRoot({
            uploadUrl: ENDPOINT.service.uploadFile,
            fileDescUrl: ENDPOINT.service.updateFileDesc,
            token: encryptStorage.getItem('accessToken'),
        }),
        AttendeeModule,
        AgendaModule,
        InvitationModule,
        SharedModule,
        NgxMatSelectSearchModule,
        DateInputModule,
        FileInputModule,
        VoteResultModule,
        AgendaReservationModule,
        JoinResultModule,
        FileOpenModule,
        FollowUpModule,
        AgendaMinuteModule,
        MinuteModule,
        SearchOptionModule,
        DocumentUploadModule,
        TextSuggestionModule,
        NgxMaskModule
    ],
})
export class MeetingEditModule { }
