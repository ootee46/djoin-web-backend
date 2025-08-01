import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AttachmentModule } from '@oot/attachment/attachment.module';
import { DateInputModule } from '@oot/date-input/date-input.module';
import { FileInputModule } from '@oot/file-input/file-input.module';
import { ENDPOINT } from 'app/constants/endpoint';
import { SharedModule } from 'app/shared/shared.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { FollowUpComponent } from './follow-up.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FollowUpFormComponent } from './form/form.component';
import { SearchOptionModule } from '@oot/search-option/search-option.module';
import { DirectiveModule } from 'app/directive/directive.module';
import { encryptStorage } from 'app/constants/constant';

const routes: Route[] = [
    {
        path: '',
        component: FollowUpComponent
    }
];

@NgModule({
    declarations: [
        FollowUpComponent, FollowUpFormComponent
    ],
    exports: [
        FollowUpComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        AttachmentModule.forRoot({
            uploadUrl: ENDPOINT.service.uploadFile,
            fileDescUrl: ENDPOINT.service.updateFileDesc,
            token: encryptStorage.getItem('accessToken'),
        }),
        DragDropModule,
        DirectiveModule,
        SharedModule,
        NgxMatSelectSearchModule,
        DateInputModule,
        FileInputModule,
        SearchOptionModule
    ],
})
export class FollowUpModule { }
