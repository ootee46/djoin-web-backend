import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { SharedModule } from 'app/shared/shared.module';
import { CalendarComponent } from './calendar.component';
import { CalendarResolver } from './calendar.resolvers';

const routes: Route[] = [
    {
        path: '',
        component: CalendarComponent,
        resolve: [CalendarResolver]
    }
];

@NgModule({
    declarations: [
        CalendarComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        FullCalendarModule,
        SharedModule
    ],
})
export class CalendarModule { }
