import { VenueListComponent } from './venue-list/venue-list.component';
import { VenueFormComponent } from './venue-form/venue-form.component';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { VenueResolver } from './venue.resolvers';

const routes: Route[] = [
    {
        path: '',
        component: VenueListComponent,
        resolve: [VenueResolver]
    }
];

@NgModule({
    declarations: [
        VenueListComponent, VenueFormComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        SharedModule
    ],
})
export class VenueModule { }
