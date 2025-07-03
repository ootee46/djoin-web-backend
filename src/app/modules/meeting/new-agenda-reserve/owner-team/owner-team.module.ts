/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { NgModule } from '@angular/core';
import { Route } from '@angular/router';
import { SearchOptionModule } from '@oot/search-option/search-option.module';
import { SelectSearchModule } from '@oot/select-search/select-search.module';
import { SharedModule } from 'app/shared/shared.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { OwnerTeamComponent } from './owner-team.component';

const routes: Route[] = [
    {
        path: '',
        component: OwnerTeamComponent
    }
];

@NgModule({
    declarations: [
        OwnerTeamComponent
    ],
    exports: [OwnerTeamComponent],
    imports: [
        SharedModule,
        NgxMatSelectSearchModule,
        SelectSearchModule,
        SearchOptionModule,
    ],
})
export class OwnerTeamModule {

}
