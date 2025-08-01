import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot,
} from '@angular/router';
import { DataListModel } from 'app/models/data-list.model';
import { QueryListModel } from 'app/models/query-list.model';
import { StandardModel } from 'app/models/standard.model';
import { forkJoin, Observable } from 'rxjs';
import { AgendaReserveService } from './agenda-reserve.service';
@Injectable({
    providedIn: 'root',
})
export class AgendaReserveResolver
    implements Resolve<Observable<DataListModel<StandardModel>>>
{
    constructor(private _service: AgendaReserveService) {}
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> {
        const searchQuery = new QueryListModel({});
        if (route.paramMap.get('id')) {
            const id = route.paramMap.get('id');
            return forkJoin([
                this._service.getData(id),
                this._service.getAllUser(),
                this._service.getDocumentType(),
            ]);
        } else {
            return forkJoin([
                this._service.getDatas(searchQuery),
                this._service.getAllUser(),
                this._service.getMeeting(),
                this._service.getConfidential(),
                this._service.getObjective(),
            ]);
        }
    }
}
