import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, switchMap, tap } from 'rxjs';
import { DataListModel } from 'app/models/data-list.model';
import { EmployeeModel } from 'app/models/employee.model';
import { GlobalService } from 'app/services/global.service';
import { PageQueryModel } from 'app/models/page-query.model';
import { ENDPOINT } from 'app/constants/endpoint';
import { SuccessModel } from 'app/models/success.model';
import { QueryListModel } from 'app/models/query-list.model';
import { LdapDataModel } from 'app/models/ldap-data.model';
import { LdapSearchInputModel } from 'app/models/ldap-search-input.model';
import { LdapOptionModel } from 'app/models/ldap-option.model';

@Injectable({
    providedIn: 'root'
})
export class ActiveDirectorySearchService {
    private _listData: BehaviorSubject<LdapDataModel[] | null> = new BehaviorSubject(null);
    private _ldapOption: BehaviorSubject<LdapOptionModel[] | null> = new BehaviorSubject(null);
    constructor(private _httpClient: HttpClient) {
    }
    get listData$(): Observable<LdapDataModel[]> {
        return this._listData.asObservable();
    }
    get ldapOption$(): Observable<LdapOptionModel[]> {
        return this._ldapOption.asObservable();
    }


    clearData(): void{
        this._listData.next([]);
    }

    getDatas(query: LdapSearchInputModel): Observable<LdapDataModel[]> {
        return this._httpClient.post<LdapDataModel[]>(ENDPOINT.service.ldapSearch, query).pipe(
            tap((response: any) => {
                this._listData.next(response.map(c=>new LdapDataModel(c)));
            })
        );
    }

    getOptions(): Observable<LdapOptionModel[]> {
        return this._httpClient.post<LdapOptionModel[]>(ENDPOINT.common.ldapOption, null).pipe(
            switchMap((response: any) =>
                of(response.map(c => new LdapOptionModel(c)))
            ),
            tap((response: any) => {
                this._ldapOption.next(response.map(c => new LdapOptionModel(c)));
            })
        );
    }
}
