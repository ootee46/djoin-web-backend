import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { DataListModel } from 'app/models/data-list.model';
import { QueryListModel } from 'app/models/query-list.model';
import { StandardModel } from 'app/models/standard.model';
import { forkJoin, Observable, of } from 'rxjs';
import { MeetingSubTypeService } from './meeting-sub-type.service';
@Injectable({
    providedIn: 'root'
})
export class MeetingSubTypeResolver implements Resolve<Observable<DataListModel<StandardModel>>>
{
    constructor(private _service: MeetingSubTypeService) {
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {

        if (route.paramMap.get('id')) {
            const searchQuery = new QueryListModel({});
            searchQuery.catId = parseInt(route.paramMap.get('id'), 10);
            this._service.setDataId(searchQuery.catId);
            return forkJoin([
                this._service.getDatas(searchQuery),
                this._service.getDataCategory(searchQuery.catId)
            ]);
        }else{
            return of(null);
        }

    }
}
