import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { DataListModel } from 'app/models/data-list.model';
import { StandardModel } from 'app/models/standard.model';
import { forkJoin, Observable } from 'rxjs';
import { SigninService } from './sign-in.service';
@Injectable({
    providedIn: 'root'
})
export class SigninResolver implements Resolve<Observable<any>>
{
    constructor(private _service: SigninService) {
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return forkJoin([
            this._service.getCustomer()
        ]);
    }
}
