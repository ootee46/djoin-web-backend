/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AttachmentModule } from '@oot/attachment/attachment.module';
import { DateInputModule } from '@oot/date-input/date-input.module';
import { FileInputModule } from '@oot/file-input/file-input.module';
import { SearchOptionModule } from '@oot/search-option/search-option.module';
import { TextSuggestionModule } from '@oot/text-suggestion/text-suggestion.module';
import { encryptStorage } from 'app/constants/constant';
import { ENDPOINT } from 'app/constants/endpoint';
import { MeetingSearchModule } from 'app/modules/shares/meeting-search/meeting-search.module';
import { SharedModule } from 'app/shared/shared.module';
import { NgxMaskModule } from 'ngx-mask';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { MeetingMgmFormComponent } from './form/form.component';
import { MeetingMgmListComponent } from './list/list.component';
import { MeetingMgmResolver } from './meeting-mgm.resolvers';

const routes: Route[] = [
    {
        path: '',
        component: MeetingMgmListComponent,
        resolve: [MeetingMgmResolver]
    },
    { path: 'edit', loadChildren: () => import('app/modules/meeting/meeting-mgm/edit/edit.module').then(m => m.MeetingEditModule) },
];

@NgModule({
    declarations: [
        MeetingMgmListComponent, MeetingMgmFormComponent
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
        MeetingSearchModule,
        SearchOptionModule,
        NgxMaskModule.forRoot(),
        TextSuggestionModule
    ],
})
export class MeetingMgmModule { }
