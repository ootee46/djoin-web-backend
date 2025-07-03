import { DocumentTemplateMgmResolver } from './document-template-mgm.resolvers';
import { DocumentTemplateMgmListComponent } from './list/list.component';
import { DocumentTemplateMgmFormComponent } from './form/form.component';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AttachmentModule } from '@oot/attachment/attachment.module';
import { DateInputModule } from '@oot/date-input/date-input.module';
import { FileInputModule } from '@oot/file-input/file-input.module';
import { ENDPOINT } from 'app/constants/endpoint';
import { SharedModule } from 'app/shared/shared.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { DirectiveModule } from 'app/directive/directive.module';
import { encryptStorage } from 'app/constants/constant';

const routes: Route[] = [
    {
        path: '',
        component: DocumentTemplateMgmListComponent,
        resolve: [DocumentTemplateMgmResolver]
    }
];

@NgModule({
    declarations: [
        DocumentTemplateMgmListComponent, DocumentTemplateMgmFormComponent
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
        DirectiveModule,
        DateInputModule,
        FileInputModule.forRoot({
            uploadUrl: ENDPOINT.service.uploadFile,
            fileDescUrl: ENDPOINT.service.updateFileDesc,
            token: encryptStorage.getItem('accessToken'),
        })
    ],
})
export class DocumentTemplateMgmModule { }
