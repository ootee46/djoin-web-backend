import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { QueryListModel } from 'app/models/query-list.model';
import { forkJoin, Observable } from 'rxjs';
import { CalendarService } from './calendar.service';

@Injectable({
    providedIn: 'root'
})
export class CalendarResolver implements Resolve<Observable<any>>
{
    constructor(private _service: CalendarService) {
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {

      return forkJoin([
        this._service.getCalendar()
    ]);
    }
}
