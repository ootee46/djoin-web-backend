import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { QueryListModel } from 'app/models/query-list.model';
import { forkJoin, Observable } from 'rxjs';

import { ApproverConfigService } from './approver-config.service';

@Injectable({
    providedIn: 'root'
})
export class ApproverConfigResolver implements Resolve<Observable<any>>
{
    constructor(private _service: ApproverConfigService) {
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const searchQuery = new QueryListModel({});
        return forkJoin([
            this._service.getDatas(searchQuery),
            this._service.getMeetingTypes(),
            this._service.getAgendaObjectives(),
            this._service.getAgendaConfidentials(),
            this._service.getAgendaApproverFlow(),
            this._service.getApproverSteps()
        ]);
    }
}
