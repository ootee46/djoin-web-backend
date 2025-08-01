import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { DataListModel } from 'app/models/data-list.model';
import { QueryListModel } from 'app/models/query-list.model';
import { StandardModel } from 'app/models/standard.model';
import { forkJoin, Observable, of } from 'rxjs';
import { AgendaService } from './edit/agenda/agenda.service';
import { MeetingMgmService } from './meeting-mgm.service';
@Injectable({
    providedIn: 'root'
})
export class MeetingMgmResolver implements Resolve<Observable<DataListModel<StandardModel>>>
{
    constructor(private _service: MeetingMgmService, private _agendaService: AgendaService) {
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const searchQuery = new QueryListModel({});


        if (route.paramMap.get('id')) {
            const id = route.paramMap.get('id');
            // return forkJoin([
            //     this._service.getAgendaRequest(id),
            //     this._service.getAllUser(),
            //     this._service.getAgendaApproveFlow(),
            //     this._service.getMeetingType(),
            //     this._service.getMeetingGroup(),
            //     this._service.getDocumentType(),
            //     this._service.getVenue()
            // ]);
            return of(true);
        }else{
            return forkJoin([
                this._service.getDatas(searchQuery),
                this._service.getMeetingType(),
                this._service.getMeetingGroup(),
                this._service.getDocumentType(),
                this._service.getVenue(),
                this._service.getAgendaApproveFlow(),
            ]);
        }
    }
}
