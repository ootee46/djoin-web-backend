import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { DataListModel } from 'app/models/data-list.model';
import { QueryListModel } from 'app/models/query-list.model';
import { StandardModel } from 'app/models/standard.model';
import { forkJoin, Observable } from 'rxjs';
import { DocumentTemplateMgmService } from './document-template-mgm.service';
@Injectable({
    providedIn: 'root'
})
export class DocumentTemplateMgmResolver implements Resolve<Observable<DataListModel<StandardModel>>>
{
    constructor(private _service: DocumentTemplateMgmService) {
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const searchQuery = new QueryListModel({});
        return forkJoin([
            this._service.getDatas(searchQuery)
        ]);
    }
}
