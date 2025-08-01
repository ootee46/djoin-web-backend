import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { DataListModel } from 'app/models/data-list.model';
import { QueryListModel } from 'app/models/query-list.model';
import { StandardModel } from 'app/models/standard.model';
import { forkJoin, Observable } from 'rxjs';
import { MeetingRoomService } from './meeting-room.service';
@Injectable({
    providedIn: 'root'
})
export class MeetingRoomResolver implements Resolve<Observable<DataListModel<StandardModel>>>
{
    constructor(private _service: MeetingRoomService) {
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const searchQuery = new QueryListModel({});
        return forkJoin([
            this._service.getDatas(searchQuery),
            this._service.getAdminUser()
        ]);
    }
}
