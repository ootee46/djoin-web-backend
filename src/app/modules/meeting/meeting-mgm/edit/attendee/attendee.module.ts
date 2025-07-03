/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { NgModule } from '@angular/core';
import { AttachmentModule } from '@oot/attachment/attachment.module';
import { DateInputModule } from '@oot/date-input/date-input.module';
import { FileInputModule } from '@oot/file-input/file-input.module';
import { SearchOptionModule } from '@oot/search-option/search-option.module';
import { SelectSearchModule } from '@oot/select-search/select-search.module';
import { encryptStorage } from 'app/constants/constant';
import { ENDPOINT } from 'app/constants/endpoint';
import { SharedModule } from 'app/shared/shared.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { AttendeeComponent } from './attendee.component';


@NgModule({
    declarations: [
        AttendeeComponent
    ],
    exports: [AttendeeComponent],
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
export class AttendeeModule {

    // constructor(route: ActivatedRoute){
    //     console.log(route.snapshot.paramMap.get('id'));
    // }
    // static forChild(): ModuleWithProviders<AttendeeModule> {
    //     return {
    //         ngModule: AttendeeModule,
    //         providers: [AttendeeService]
    //     };
    // }
}
