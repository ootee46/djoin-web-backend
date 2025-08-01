import { ActiveDirectorySearchComponent } from './active-directory-search.component';
import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FuseLoadingBarModule } from '@fuse/components/loading-bar';

@NgModule({
    declarations: [
        ActiveDirectorySearchComponent
    ],
    imports: [
        SharedModule,
        FuseLoadingBarModule
    ],
    exports: [ActiveDirectorySearchComponent]
})
export class ActiveDirecctorySearchModule { }
