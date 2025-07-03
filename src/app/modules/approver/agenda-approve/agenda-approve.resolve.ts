import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { QueryListModel } from 'app/models/query-list.model';
import { forkJoin, Observable } from 'rxjs';
import { AgendaApproveService } from './agenda-approve.service';
import { AgendaReserveService } from 'app/modules/meeting/agenda-reserve/agenda-reserve.service';

@Injectable({
    providedIn: 'root'
})
export class AgendaApproveResolver implements Resolve<Observable<any>>
{
    constructor(private _service: AgendaApproveService,private _reserveService: AgendaReserveService) {
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const searchQuery = new QueryListModel({});
        if (route.paramMap.get('id')) {
            const id = route.paramMap.get('id');
            return forkJoin([
                this._service.getData(id),
                this._reserveService.getDocumentType(),
                this._reserveService.getRelation(id),
            ]);
        }else{
            return forkJoin([
                this._service.getDatas(searchQuery)
            ]);
        }

    }
}
