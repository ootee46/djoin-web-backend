import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AttachmentModule } from '@oot/attachment/attachment.module';
import { DateInputModule } from '@oot/date-input/date-input.module';
import { FileInputModule } from '@oot/file-input/file-input.module';
import { encryptStorage } from 'app/constants/constant';
import { ENDPOINT } from 'app/constants/endpoint';
import { SharedModule } from 'app/shared/shared.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { ApproverGroupResolver } from './approver-group.resolvers';
import { ApproverGroupFormComponent } from './form/form.component';
import { ApproverGroupListComponent } from './list/list.component';

const routes: Route[] = [
    {
        path: '',
        component: ApproverGroupListComponent,
        resolve:[ApproverGroupResolver]
    }
];

@NgModule({
    declarations: [
        ApproverGroupListComponent, ApproverGroupFormComponent
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
export class ApproverGroupModule { }
