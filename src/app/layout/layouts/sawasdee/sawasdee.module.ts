import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FuseFullscreenModule } from '@fuse/components/fullscreen';
import { FuseLoadingBarModule } from '@fuse/components/loading-bar';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { UserModule } from 'app/layout/common/user/user.module';
import { SharedModule } from 'app/shared/shared.module';
import { SawasdeeLayoutComponent } from './sawasdee.component';

@NgModule({
    declarations: [
        SawasdeeLayoutComponent
    ],
    imports     : [
        HttpClientModule,
        RouterModule,
        FuseFullscreenModule,
        FuseLoadingBarModule,
        FuseNavigationModule,
        UserModule,
        SharedModule
    ],
    exports     : [
        SawasdeeLayoutComponent
    ]
})
export class SawasdeeLayoutModule
{
}
