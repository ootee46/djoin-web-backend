import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AttachmentModule } from '@oot/attachment/attachment.module';
import { DateInputModule } from '@oot/date-input/date-input.module';
import { FileInputModule } from '@oot/file-input/file-input.module';
import { ENDPOINT } from 'app/constants/endpoint';
import { SharedModule } from 'app/shared/shared.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { VoteResultComponent } from './vote-result.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { encryptStorage } from 'app/constants/constant';
import { VoteResultFormComponent } from './form/form.component';

const routes: Route[] = [
    {
        path: '',
        component: VoteResultComponent
    }
];

@NgModule({
    declarations: [
        VoteResultComponent,
        VoteResultFormComponent
    ],
    exports: [
        VoteResultComponent
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
export class VoteResultModule { }
