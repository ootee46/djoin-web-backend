import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DateInputModule } from '@oot/date-input/date-input.module';
import { SharedModule } from 'app/shared/shared.module';
import { ErrorLogListComponent } from './list/list.component';
import { ErrorLogResolver } from './error-log.resolvers';

const routes: Route[] = [
    {
        path: '',
        component: ErrorLogListComponent,
        resolve:[ErrorLogResolver]
    }
];

@NgModule({
    declarations: [
        ErrorLogListComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        SharedModule,
        DateInputModule,
    ],
})
export class ErrorLogModule { }
