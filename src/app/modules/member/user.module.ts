/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';


const routes: Route[] = [
    {path: 'user', loadChildren: () => import('app/modules/member/user/user.module').then(m => m.UserModule)},
    {path: 'user-group', loadChildren: () => import('app/modules/member/user-group/user-group.module').then(m => m.UserGroupModule)},
];

@NgModule({
    declarations: [

    ],
    imports: [
        RouterModule.forChild(routes),
        SharedModule,
        NgxMatSelectSearchModule
    ]
})
export class UserModule {}
