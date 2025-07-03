import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DateInputModule } from '@oot/date-input/date-input.module';
import { SharedModule } from 'app/shared/shared.module';
import { LoginLogListComponent } from './list/list.component';
import { LoginLogResolver } from './login-log.resolvers';

const routes: Route[] = [
    {
        path: '',
        component: LoginLogListComponent,
        resolve:[LoginLogResolver]
    }
];

@NgModule({
    declarations: [
        LoginLogListComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        SharedModule,
        DateInputModule,
    ],
})
export class LoginLogModule { }
