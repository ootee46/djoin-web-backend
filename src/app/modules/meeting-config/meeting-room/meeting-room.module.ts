import { MeetingRoomResolver } from './meeting-room.resolvers';
import { MeetingRoomListComponent } from './list/list.component';
import { MeetingRoomFormComponent } from './form/form.component';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AttachmentModule } from '@oot/attachment/attachment.module';
import { DateInputModule } from '@oot/date-input/date-input.module';
import { FileInputModule } from '@oot/file-input/file-input.module';
import { ENDPOINT } from 'app/constants/endpoint';
import { SharedModule } from 'app/shared/shared.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ColorPickerModule } from 'ngx-color-picker';
import { encryptStorage } from 'app/constants/constant';

const routes: Route[] = [
    {
        path: '',
        component: MeetingRoomListComponent,
        resolve:[MeetingRoomResolver]
    }
];

@NgModule({
    declarations: [
        MeetingRoomListComponent, MeetingRoomFormComponent
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
        ColorPickerModule,
        DateInputModule,
        FileInputModule
    ],
})
export class MeetingRoomModule { }
