/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { NgModule } from '@angular/core';
import { Route } from '@angular/router';
import { AttachmentModule } from '@oot/attachment/attachment.module';
import { DateInputModule } from '@oot/date-input/date-input.module';
import { FileInputModule } from '@oot/file-input/file-input.module';
import { SearchOptionModule } from '@oot/search-option/search-option.module';
import { SelectSearchModule } from '@oot/select-search/select-search.module';
import { encryptStorage } from 'app/constants/constant';
import { ENDPOINT } from 'app/constants/endpoint';
import { SharedModule } from 'app/shared/shared.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { MeetingAgendaComponent } from './meeting-agenda.component';

const routes: Route[] = [
    {
        path: '',
        component: MeetingAgendaComponent
    }
];

@NgModule({
    declarations: [
        MeetingAgendaComponent
    ],
    exports: [MeetingAgendaComponent],
    imports: [
        AttachmentModule.forRoot({
            uploadUrl: ENDPOINT.service.uploadFile,
            fileDescUrl: ENDPOINT.service.updateFileDesc,
            token: encryptStorage.getItem('accessToken'),
        }),
        SharedModule,
        NgxMatSelectSearchModule,
        SelectSearchModule,
        SearchOptionModule,
        DateInputModule,
        FileInputModule
    ],
})
export class MeetingAgendaModule {

}
