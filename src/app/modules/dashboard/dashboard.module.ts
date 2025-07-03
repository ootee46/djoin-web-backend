import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { OverviewComponent } from '../meeting/meeting-mgm/edit/overview/overview.component';
import { DashboardAgendaApproveComponent } from './agenda-approve/agenda-approve.component';
import { DashboardAgendaRequestComponent } from './agenda-request/agenda-request.component';
import { DashboardComponent } from './dashboard.component';
import { DashboardResolver } from './dashboard.resolvers';
import { DashboardMeetingHistoryComponent } from './meeting-history/meeting-history.component';
import { DashboardMinuteApproveComponent } from './minute-approve/minute-approve.component';
import { DashboardPackageInfoComponent } from './package-info/package-info.component';
import { DashboardUpcomingComponent } from './upcoming/upcoming.component';
import { DateInputModule } from '@oot/date-input/date-input.module';
import { DashboardAgendaApproveHistoryComponent } from './agenda-approve-history/agenda-approve-history.component';
import { DashboardAgendaApproveDetailComponent } from './agenda-approve-history/detail/detail.component';
import { DashboardAgendaApprovePermissionComponent } from './agenda-approve-history/view-permission/view-permission.component';
import { DirectiveModule } from 'app/directive/directive.module';
import { DashboardMinuteApproveHistoryComponent } from './minute-approve-history/minute-approve-history.component';
import { DashboardMinuteApprovePermissionComponent } from './minute-approve-history/view-permission/view-permission.component';
import { DashboardMinuteApproveDetailComponent } from './minute-approve-history/detail/detail.component';
import { SearchOptionModule } from '@oot/search-option/search-option.module';

const routes: Route[] = [
    {path: '', pathMatch : 'full', redirectTo: 'overview'},
    {
        path: 'overview',
        component: DashboardComponent,
        resolve: [DashboardResolver]
    },
    {
        path: 'upcoming',
        component: DashboardComponent,
        resolve: [DashboardResolver]
    },
    {
        path: 'history',
        component: DashboardComponent,
        resolve: [DashboardResolver]
    },
    {
        path: 'agenda-approve',
        component: DashboardComponent,
        resolve: [DashboardResolver]
    },
    {
        path: 'agenda-approve-history',
        component: DashboardComponent,
        resolve: [DashboardResolver]
    },
    {
        path: 'minute-approve',
        component: DashboardComponent,
        resolve: [DashboardResolver]
    },
    {
        path: 'minute-approve-history',
        component: DashboardComponent,
        resolve: [DashboardResolver]
    },
    {
        path: 'agenda-request',
        component: DashboardComponent,
        resolve: [DashboardResolver]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        DateInputModule,
        DirectiveModule,
        SearchOptionModule,
        SharedModule
    ],
    declarations: [DashboardComponent
        , DashboardPackageInfoComponent
        , DashboardAgendaApproveComponent
        , DashboardAgendaRequestComponent
        , DashboardMeetingHistoryComponent
        , DashboardUpcomingComponent
        , DashboardAgendaApproveHistoryComponent
        , DashboardAgendaApproveDetailComponent
        , DashboardAgendaApprovePermissionComponent
        , DashboardMinuteApproveHistoryComponent
        , DashboardMinuteApprovePermissionComponent
        , DashboardMinuteApproveDetailComponent
        , DashboardMinuteApproveComponent]
})
export class DashboardModule { }
