import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { DataListModel } from 'app/models/data-list.model';
import { QueryListModel } from 'app/models/query-list.model';
import { forkJoin, Observable } from 'rxjs';
import { AgendaApproverFlowService } from './agenda-approver-flow.service';
@Injectable({
    providedIn: 'root'
})
export class AgendaApproverFlowResolver implements Resolve<Observable<any>>
{
    constructor(private _service: AgendaApproverFlowService) {
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const searchQuery = new QueryListModel({});
        return forkJoin([
            this._service.getDatas(searchQuery)
        ]);
    }
}
