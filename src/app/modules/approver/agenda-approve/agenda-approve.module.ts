import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DateInputModule } from '@oot/date-input/date-input.module';
import { DirectiveModule } from 'app/directive/directive.module';
import { SharedModule } from 'app/shared/shared.module';
import { AgendaApproveComponent } from './agenda-approve.component';
import { AgendaApproveResolver } from './agenda-approve.resolve';
import { AgendaApproveDetailComponent } from './detail/detail.component';
import { AgendaApprovePermissionComponent } from './view-permission/view-permission.component';
import { FileInputModule } from '@oot/file-input/file-input.module';
import { ENDPOINT } from 'app/constants/endpoint';
import { encryptStorage } from 'app/constants/constant';
import { SearchOptionModule } from '@oot/search-option/search-option.module';

const routes: Route[] = [
    {
        path: '',
        component: AgendaApproveComponent,
        resolve: [AgendaApproveResolver]
    },
    {
        path: 'detail/:id',
        component: AgendaApproveDetailComponent,
        resolve: [AgendaApproveResolver]
    }
];


@NgModule({
  imports: [
    RouterModule.forChild(routes),
    DirectiveModule,
    SearchOptionModule,
    FileInputModule.forRoot({
        uploadUrl: ENDPOINT.service.uploadFile,
        fileDescUrl: ENDPOINT.service.updateFileDesc,
        token: encryptStorage.getItem('accessToken'),
    }),
    SharedModule,
    DateInputModule
  ],
  declarations: [AgendaApproveComponent,AgendaApproveDetailComponent, AgendaApprovePermissionComponent]
})
export class AgendaApproveModule { }
