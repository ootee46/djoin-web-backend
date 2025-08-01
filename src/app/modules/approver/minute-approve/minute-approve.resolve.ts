import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { QueryListModel } from 'app/models/query-list.model';
import { forkJoin, Observable } from 'rxjs';
import { MinuteApproveService } from './minute-approve.service';

@Injectable({
    providedIn: 'root'
})
export class MinuteApproveResolver implements Resolve<Observable<any>>
{
    constructor(private _service: MinuteApproveService) {
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const searchQuery = new QueryListModel({});
        if (route.paramMap.get('id')) {
            const id = route.paramMap.get('id');
            return forkJoin([
                this._service.getData(id)
            ]);
        }else{
            return forkJoin([
                this._service.getDatas(searchQuery)
            ]);
        }

    }
}
