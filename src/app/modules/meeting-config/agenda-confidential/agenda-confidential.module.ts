import { AgendaConfidentialResolver } from './agenda-confidential.resolvers';
import { AgendaConfidentialListComponent } from './list/list.component';
import { AgendaConfidentialFormComponent } from './form/form.component';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AttachmentModule } from '@oot/attachment/attachment.module';
import { DateInputModule } from '@oot/date-input/date-input.module';
import { FileInputModule } from '@oot/file-input/file-input.module';
import { ENDPOINT } from 'app/constants/endpoint';
import { SharedModule } from 'app/shared/shared.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { encryptStorage } from 'app/constants/constant';

const routes: Route[] = [
    {
        path: '',
        component: AgendaConfidentialListComponent,
        resolve:[AgendaConfidentialResolver]
    }
];

@NgModule({
    declarations: [
        AgendaConfidentialListComponent, AgendaConfidentialFormComponent
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
export class AgendaConfidentialModule { }
