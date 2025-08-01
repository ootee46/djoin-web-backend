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
import { ChangeMeetingComponent } from './change-meeting.component';
import { encryptStorage } from 'app/constants/constant';



@NgModule({
    declarations: [
        ChangeMeetingComponent
    ],
    exports: [ChangeMeetingComponent],
    imports: [
        AttachmentModule.forRoot({
            uploadUrl: ENDPOINT.service.uploadFile,
            fileDescUrl: ENDPOINT.service.updateFileDesc,
            token: encryptStorage.getItem('accessToken'),
        }),
        SharedModule,
        NgxMatSelectSearchModule,
        SelectSearchModule,
        SearchOptionModule,
        DateInputModule,
        FileInputModule
    ],
})
export class ChangeMeetingModule {

}
