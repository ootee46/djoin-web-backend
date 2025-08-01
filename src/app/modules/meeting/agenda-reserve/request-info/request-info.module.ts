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
import { RequestInfoComponent } from './request-info.component';
import { DirectiveModule } from 'app/directive/directive.module';
import { RequestInfoPermissionComponent } from './view-permission/view-permission.component';
import { RequestInfoDocumentPermissionComponent } from './document-permission/permission.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

const routes: Route[] = [
    {
        path: '',
        component: RequestInfoComponent
    }
];

@NgModule({
    declarations: [
        RequestInfoComponent,RequestInfoPermissionComponent, RequestInfoDocumentPermissionComponent
    ],
    exports: [RequestInfoComponent],
    imports: [
        SharedModule,
        NgxMatSelectSearchModule,
        SelectSearchModule,
        SearchOptionModule,
        DragDropModule,
        DateInputModule,
        FileInputModule,
        DirectiveModule
    ],
})
export class RequestInfoModule {

}
