import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { QueryListModel } from 'app/models/query-list.model';
import { forkJoin, Observable } from 'rxjs';

import { FailLoginLogService } from './fail-login-log.service';

@Injectable({
    providedIn: 'root'
})
export class FailLoginLogResolver implements Resolve<Observable<any>>
{
    constructor(private _service: FailLoginLogService) {
    }
    resolve(): Observable<any> {
        const searchQuery = new QueryListModel({});
        return forkJoin([
            this._service.getDatas(searchQuery)
        ]);
    }
}
