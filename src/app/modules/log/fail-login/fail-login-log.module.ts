import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DateInputModule } from '@oot/date-input/date-input.module';
import { SharedModule } from 'app/shared/shared.module';
import { FailLoginLogListComponent } from './list/list.component';
import { FailLoginLogResolver } from './fail-login-log.resolvers';

const routes: Route[] = [
    {
        path: '',
        component: FailLoginLogListComponent,
        resolve:[FailLoginLogResolver]
    }
];

@NgModule({
    declarations: [
        FailLoginLogListComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        SharedModule,
        DateInputModule,
    ],
})
export class FailLoginLogModule { }
