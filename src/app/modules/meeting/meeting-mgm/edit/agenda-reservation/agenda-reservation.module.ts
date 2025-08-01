import { NgModule } from '@angular/core';
import { AgendaReservationComponent } from './agenda-reservation.component';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { DirectiveModule } from 'app/directive/directive.module';
import { AgendaReservationPermissionComponent } from './view-permission/view-permission.component';
@NgModule({
  imports: [
    RouterModule,
    SharedModule,
    DirectiveModule
  ],
  declarations: [AgendaReservationComponent,AgendaReservationPermissionComponent],
  exports: [AgendaReservationComponent]
})
export class AgendaReservationModule { }
