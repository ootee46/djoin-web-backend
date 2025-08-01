import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { QueryListModel } from 'app/models/query-list.model';
import { forkJoin, Observable } from 'rxjs';
import { ApproverGroupService } from './approver-group.service';

@Injectable({
    providedIn: 'root'
})
export class ApproverGroupResolver implements Resolve<Observable<any>>
{
    constructor(private _service: ApproverGroupService) {
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const searchQuery = new QueryListModel({});
        return forkJoin([
            this._service.getDatas(searchQuery),
            this._service.getSystemUser()
        ]);
    }
}
