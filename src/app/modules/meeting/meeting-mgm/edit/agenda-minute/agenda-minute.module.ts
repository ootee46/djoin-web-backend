import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AttachmentModule } from '@oot/attachment/attachment.module';
import { DateInputModule } from '@oot/date-input/date-input.module';
import { FileInputModule } from '@oot/file-input/file-input.module';
import { ENDPOINT } from 'app/constants/endpoint';
import { SharedModule } from 'app/shared/shared.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AgendaMinuteComponent } from './agenda-minute.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DirectiveModule } from 'app/directive/directive.module';
import { AgendaMinuteConfirmFormComponent } from './form/form.component';
import { encryptStorage } from 'app/constants/constant';

const routes: Route[] = [
    {
        path: '',
        component: AgendaMinuteComponent
    }
];

@NgModule({
    declarations: [
        AgendaMinuteComponent, AgendaMinuteConfirmFormComponent
    ],
    exports: [
        AgendaMinuteComponent
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
        FileInputModule,
        DirectiveModule
    ],
})
export class AgendaMinuteModule { }
