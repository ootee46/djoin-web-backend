import { EmployeeSearchComponent } from './employee-search.component';
import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
    declarations: [
       EmployeeSearchComponent
    ],
    imports: [
        SharedModule,
    ],
    exports: [ EmployeeSearchComponent ]
})
export class EmployeeSearchModule { }
