import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { DataListModel } from 'app/models/data-list.model';
import { QueryListModel } from 'app/models/query-list.model';
import { MemberModel } from 'app/models/member.model';
import { forkJoin, Observable } from 'rxjs';
import { UserDataService } from './user.service';
@Injectable({
    providedIn: 'root'
})
export class UserResolver implements Resolve<Observable<DataListModel<MemberModel>>>
{
    constructor(private _service: UserDataService) {
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const searchQuery = new QueryListModel({});
        searchQuery.pageSize = 50;
        return forkJoin([
            this._service.getDatas(searchQuery),
            this._service.getMeetingRoom(),
            this._service.getUserGroup(),
            this._service.getApproverPosition(),
            this._service.getUsers()
        ]);
    }
}
