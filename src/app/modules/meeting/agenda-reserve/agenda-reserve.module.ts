import { AgendaReserveResolver } from './agenda-reserve.resolvers';
import { AgendaReserveListComponent } from './list/list.component';
import { AgendaReserveFormComponent } from './form/form.component';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AttachmentModule } from '@oot/attachment/attachment.module';
import { DateInputModule } from '@oot/date-input/date-input.module';
import { FileInputModule } from '@oot/file-input/file-input.module';
import { ENDPOINT } from 'app/constants/endpoint';
import { SharedModule } from 'app/shared/shared.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AgendaReserveDetailComponent } from './detail/detail.component';
import { MeetingAgendaModule } from './meeting-agenda/meeting-agenda.module';
import { MinuteOfMeetingModule } from './minute-of-meeting/minute-of-meeting.module';
import { OwnerTeamModule } from './owner-team/owner-team.module';
import { RequestInfoModule } from './request-info/request-info.module';
import { UploadDocumentModule } from './upload-document/upload-document.module';
import { SearchOptionModule } from '@oot/search-option/search-option.module';
import { encryptStorage } from 'app/constants/constant';

const routes: Route[] = [
    {
        path: '',
        component: AgendaReserveListComponent,
        resolve: [AgendaReserveResolver]
    },
    {
        path: 'detail/:id',
        component: AgendaReserveDetailComponent,
        resolve: [AgendaReserveResolver]
    }
];

@NgModule({
    declarations: [
        AgendaReserveListComponent, AgendaReserveFormComponent, AgendaReserveDetailComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        AttachmentModule.forRoot({
            uploadUrl: ENDPOINT.service.uploadFile,
            fileDescUrl: ENDPOINT.service.updateFileDesc,
            token: encryptStorage.getItem('accessToken'),
        }),
        SharedModule,
        NgxMatSelectSearchModule,
        DateInputModule,
        FileInputModule,
        DragDropModule,
        MeetingAgendaModule,
        MinuteOfMeetingModule,
        OwnerTeamModule,
        RequestInfoModule,
        SearchOptionModule,
        UploadDocumentModule
    ],
})
export class AgendaReserveModule { }
