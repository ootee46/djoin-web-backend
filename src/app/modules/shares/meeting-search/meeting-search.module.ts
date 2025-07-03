import { NgModule } from '@angular/core';
import { MeetingSearchComponent } from './meeting-search.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule
  ],
  exports: [MeetingSearchComponent],
  declarations: [MeetingSearchComponent]
})
export class MeetingSearchModule { }
