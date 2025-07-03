import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AttachmentModule } from '@oot/attachment/attachment.module';
import { DateInputModule } from '@oot/date-input/date-input.module';
import { FileInputModule } from '@oot/file-input/file-input.module';
import { ENDPOINT } from 'app/constants/endpoint';
import { SharedModule } from 'app/shared/shared.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { JoinResultComponent } from './join-result.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { encryptStorage } from 'app/constants/constant';

const routes: Route[] = [
    {
        path: '',
        component: JoinResultComponent
    }
];

@NgModule({
    declarations: [
        JoinResultComponent
    ],
    exports: [
        JoinResultComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        AttachmentModule.forRoot({
            uploadUrl: ENDPOINT.service.uploadFile,
            fileDescUrl: ENDPOINT.service.updateFileDesc,
            token: encryptStorage.getItem('accessToken'),
        }),
        DragDropModule,
        SharedModule,
        NgxMatSelectSearchModule,
        DateInputModule,
        FileInputModule
    ],
})
export class JoinResultModule { }
