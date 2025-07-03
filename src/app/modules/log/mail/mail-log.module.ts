import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DateInputModule } from '@oot/date-input/date-input.module';
import { SharedModule } from 'app/shared/shared.module';
import { MailLogListComponent } from './list/list.component';
import { MailLogResolver } from './mail-log.resolvers';

const routes: Route[] = [
    {
        path: '',
        component: MailLogListComponent,
        resolve:[MailLogResolver]
    }
];

@NgModule({
    declarations: [
        MailLogListComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        SharedModule,
        DateInputModule,
    ],
})
export class MailLogModule { }
