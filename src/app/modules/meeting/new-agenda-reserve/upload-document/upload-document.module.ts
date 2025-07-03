/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AttachmentModule } from '@oot/attachment/attachment.module';
import { DateInputModule } from '@oot/date-input/date-input.module';
import { FileInputModule } from '@oot/file-input/file-input.module';
import { ENDPOINT } from 'app/constants/endpoint';
import { SharedModule } from 'app/shared/shared.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { SelectSearchModule } from '@oot/select-search/select-search.module';
import { SearchOptionModule } from '@oot/search-option/search-option.module';
import { UploadDocumentComponent } from './upload-document.component';
import { DocumentPermissionComponent } from './document-permission/permission.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DirectiveModule } from 'app/directive/directive.module';
import { encryptStorage } from 'app/constants/constant';

const routes: Route[] = [
    {
        path: '',
        component: UploadDocumentComponent
    }
];

@NgModule({
    declarations: [
        UploadDocumentComponent, DocumentPermissionComponent
    ],
    exports: [UploadDocumentComponent],
    imports: [
        AttachmentModule.forRoot({
            uploadUrl: ENDPOINT.service.uploadFile,
            fileDescUrl: ENDPOINT.service.updateFileDesc,
            token: encryptStorage.getItem('accessToken'),
        }),
        FileInputModule.forRoot({
            uploadUrl: ENDPOINT.service.uploadFile,
            fileDescUrl: ENDPOINT.service.updateFileDesc,
            token: encryptStorage.getItem('accessToken'),
        }),
        SharedModule,
        NgxMatSelectSearchModule,
        DragDropModule,
        SelectSearchModule,
        DirectiveModule,
        SearchOptionModule,
        DateInputModule,
        FileInputModule
    ],
})
export class UploadDocumentModule {

}
