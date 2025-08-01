import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AttachmentModule } from '@oot/attachment/attachment.module';
import { DateInputModule } from '@oot/date-input/date-input.module';
import { FileInputModule } from '@oot/file-input/file-input.module';
import { ENDPOINT } from 'app/constants/endpoint';
import { SharedModule } from 'app/shared/shared.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AgendaComponent } from './agenda.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MeetingAgendaFormComponent } from './form/form.component';
import { SearchOptionModule } from '@oot/search-option/search-option.module';
import { AgendaAttachmentPermissionComponent } from './permission/permission.component';
import { MeetingAgendaForm2Component } from './form2/form2.component';
import { DirectiveModule } from 'app/directive/directive.module';
import { MeetingSearchModule } from 'app/modules/shares/meeting-search/meeting-search.module';
import { AgendaViewPermissionComponent } from './view-permission/view-permission.component';
import { encryptStorage } from 'app/constants/constant';
import { FileHistoryComponent } from './file-history/file-history.component';
import { ReplaceAttachmentFormComponent } from './replace-attachment/replace-attachment.component';

const routes: Route[] = [
    {
        path: '',
        component: AgendaComponent,
       // resolve: [AgendaResolver]
    }
];

@NgModule({
    declarations: [
        AgendaComponent
        , MeetingAgendaFormComponent
        , AgendaAttachmentPermissionComponent
        , MeetingAgendaForm2Component
        , FileHistoryComponent
        , ReplaceAttachmentFormComponent
        , AgendaViewPermissionComponent, FileHistoryComponent
    ],
    exports: [
        AgendaComponent
    ],
    imports: [
        RouterModule.forChild(routes),
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
        DragDropModule,
        SharedModule,
        NgxMatSelectSearchModule,
        DateInputModule,
        DirectiveModule,
        SearchOptionModule,
        MeetingSearchModule,
        FileInputModule
    ],
})
export class AgendaModule { }
