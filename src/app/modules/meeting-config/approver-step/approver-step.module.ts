import { ApproverStepResolver } from './approver-step.resolvers';
import { ApproverStepListComponent } from './list/list.component';
import { ApproverStepFormComponent } from './form/form.component';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AttachmentModule } from '@oot/attachment/attachment.module';
import { DateInputModule } from '@oot/date-input/date-input.module';
import { FileInputModule } from '@oot/file-input/file-input.module';
import { ENDPOINT } from 'app/constants/endpoint';
import { SharedModule } from 'app/shared/shared.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ApproverStepPopup1Component } from './popup1/popup1.component';
import { SelectSearchModule } from '@oot/select-search/select-search.module';
import { encryptStorage } from 'app/constants/constant';

const routes: Route[] = [
    {
        path: '',
        component: ApproverStepListComponent,
        resolve:[ApproverStepResolver]
    }
];

@NgModule({
    declarations: [
        ApproverStepListComponent, ApproverStepFormComponent, ApproverStepPopup1Component
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
        SelectSearchModule,
        DateInputModule,
        FileInputModule
    ],
})
export class ApproverStepModule { }
