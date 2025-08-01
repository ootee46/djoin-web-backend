import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DirectiveModule } from 'app/directive/directive.module';
import { SharedModule } from 'app/shared/shared.module';
import { MinuteApproveComponent } from './minute-approve.component';
import { MinuteApproveResolver } from './minute-approve.resolve';
import { MinuteApproveDetailComponent } from './detail/detail.component';
import { MinuteApprovePermissionComponent } from './view-permission/view-permission.component';
import { DateInputModule } from '@oot/date-input/date-input.module';
import { FileInputModule } from '@oot/file-input/file-input.module';
import { ENDPOINT } from 'app/constants/endpoint';
import { encryptStorage } from 'app/constants/constant';

const routes: Route[] = [
    {
        path: '',
        component: MinuteApproveComponent,
        resolve: [MinuteApproveResolver]
    },
    {
        path: 'detail/:id',
        component: MinuteApproveDetailComponent,
        resolve: [MinuteApproveResolver]
    }
];


@NgModule({
  imports: [
    RouterModule.forChild(routes),
    DirectiveModule,
    SharedModule,
    FileInputModule.forRoot({
        uploadUrl: ENDPOINT.service.uploadFile,
        fileDescUrl: ENDPOINT.service.updateFileDesc,
        token: encryptStorage.getItem('accessToken'),
    }),
    DateInputModule
  ],
  declarations: [MinuteApproveComponent,MinuteApproveDetailComponent, MinuteApprovePermissionComponent]
})
export class MinuteApproveModule { }
