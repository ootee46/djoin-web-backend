import { Component, OnInit } from '@angular/core';
import { AgendaModel } from 'app/models/agenda.model';
import { QueryListModel } from 'app/models/query-list.model';
import { Observable } from 'rxjs';
import { MeetingAgendaService } from './meeting-agenda.service';

@Component({
  selector: 'app-meeting-agenda',
  templateUrl: './meeting-agenda.component.html'
})
export class MeetingAgendaComponent implements OnInit {
    bgSteps = ['bg-sky-200','bg-sky-100','bg-gray-100','bg-gray-100','bg-gray-100','bg-gray-100','bg-gray-100','bg-gray-100','bg-gray-100','bg-gray-100'];
  datas$: Observable<AgendaModel[]>;
  constructor(
      private _service: MeetingAgendaService
  ) { }

  ngOnInit(): void {
     this.datas$ = this._service.datas$;
     this._service.getDatas(new QueryListModel({})).subscribe();
  }

}
