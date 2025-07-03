import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { DataListModel } from 'app/models/data-list.model';
import { QueryListModel } from 'app/models/query-list.model';
import { forkJoin, Observable } from 'rxjs';
import { ApproverStepService } from './approver-step.service';
@Injectable({
    providedIn: 'root'
})
export class ApproverStepResolver implements Resolve<Observable<any>>
{
    constructor(private _service: ApproverStepService) {
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const searchQuery = new QueryListModel({});
        return forkJoin([
            this._service.getDatas(searchQuery),
            this._service.getUsers(),
            this._service.getApproverPosition(),
            this._service.getApproverGroup()
        ]);
    }
}
