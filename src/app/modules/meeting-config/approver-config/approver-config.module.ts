import { ApproverConfigResolver } from './approver-config.resolvers';
import { ApproverConfigListComponent } from './list/list.component';
import { ApproverConfigFormComponent } from './form/form.component';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AttachmentModule } from '@oot/attachment/attachment.module';
import { DateInputModule } from '@oot/date-input/date-input.module';
import { FileInputModule } from '@oot/file-input/file-input.module';
import { ENDPOINT } from 'app/constants/endpoint';
import { SharedModule } from 'app/shared/shared.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { encryptStorage } from 'app/constants/constant';
import { SearchOptionModule } from '@oot/search-option/search-option.module';

const routes: Route[] = [
    {
        path: '',
        component: ApproverConfigListComponent,
        resolve:[ApproverConfigResolver]
    }
];

@NgModule({
    declarations: [
        ApproverConfigListComponent, ApproverConfigFormComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        AttachmentModule.forRoot({
            uploadUrl: ENDPOINT.service.uploadFile,
            fileDescUrl: ENDPOINT.service.updateFileDesc,
            token: encryptStorage.getItem('accessToken'),
        }),
        SharedModule,
        SearchOptionModule,
        NgxMatSelectSearchModule,
        DateInputModule,
        FileInputModule
    ],
})
export class ApproverConfigModule { }
