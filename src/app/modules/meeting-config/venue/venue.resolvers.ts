import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { QueryListModel } from 'app/models/query-list.model';
import { forkJoin, Observable } from 'rxjs';
import { VenueService } from './venue.service';
@Injectable({
  providedIn: 'root'
})
export class VenueResolver implements Resolve<Observable<any>>
{
  constructor(private _service: VenueService) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const searchQuery = new QueryListModel({});
    return forkJoin([
      this._service.getDatas(searchQuery)
    ]);
  }
}
