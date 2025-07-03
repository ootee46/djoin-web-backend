import { UserListComponent } from './list/list.component';
import { UserResolver } from './user.resolvers';
import { UserFormComponent } from './form/form.component';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AttachmentModule } from '@oot/attachment/attachment.module';
import { DateInputModule } from '@oot/date-input/date-input.module';
import { FileInputModule } from '@oot/file-input/file-input.module';
import { ENDPOINT } from 'app/constants/endpoint';
import { SharedModule } from 'app/shared/shared.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ActiveDirecctorySearchModule } from 'app/modules/shares/active-directory-search/active-directory-search.module';
import { EmployeeSearchModule } from 'app/modules/shares/employee-search/employee-search.module';
import { SelectSearchModule } from '@oot/select-search/select-search.module';
import { encryptStorage } from 'app/constants/constant';
import { SearchOptionModule } from '@oot/search-option/search-option.module';

const routes: Route[] = [
    {
        path: '',
        component: UserListComponent,
        resolve: [UserResolver]
    }
];

@NgModule({
    declarations: [
        UserListComponent, UserFormComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        AttachmentModule.forRoot({
            uploadUrl: ENDPOINT.service.uploadFile,
            fileDescUrl: ENDPOINT.service.updateFileDesc,
            token: encryptStorage.getItem('accessToken'),
        }),
        SharedModule,
        ActiveDirecctorySearchModule,
        NgxMatSelectSearchModule,
        SelectSearchModule,
        DateInputModule,
        FileInputModule,
        SearchOptionModule,
        EmployeeSearchModule
    ],
})
export class UserModule { }
