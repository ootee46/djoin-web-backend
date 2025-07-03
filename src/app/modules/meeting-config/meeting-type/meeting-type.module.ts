/* eslint-disable max-len */
import { MeetingTypeResolver } from './meeting-type.resolvers';
import { MeetingTypeListComponent } from './list/list.component';
import { MeetingTypeFormComponent } from './form/form.component';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AttachmentModule } from '@oot/attachment/attachment.module';
import { DateInputModule } from '@oot/date-input/date-input.module';
import { FileInputModule } from '@oot/file-input/file-input.module';
import { ENDPOINT } from 'app/constants/endpoint';
import { SharedModule } from 'app/shared/shared.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MeetingSubTypeModule } from 'app/modules/meeting-config/meeting-type/meeting-sub-type/meeting-sub-type.module';
import { encryptStorage } from 'app/constants/constant';

const routes: Route[] = [
    {
        path: '',
        component: MeetingTypeListComponent,
        resolve:[MeetingTypeResolver]
    },
    {
        path: 'meeting-sub-type',
        loadChildren: (): Promise<typeof MeetingSubTypeModule> => import('app/modules/meeting-config/meeting-type/meeting-sub-type/meeting-sub-type.module').then(m => m.MeetingSubTypeModule)
    },
];

@NgModule({
    declarations: [
        MeetingTypeListComponent, MeetingTypeFormComponent
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
        FileInputModule
    ],
})
export class MeetingTypeModule { }
