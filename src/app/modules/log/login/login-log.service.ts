import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENDPOINT } from 'app/constants/endpoint';
import { DataListModel } from 'app/models/data-list.model';
import { LoginLogModel } from 'app/models/login-log.model';
import { QueryListModel } from 'app/models/query-list.model';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoginLogService {
    private _listData: BehaviorSubject<DataListModel<LoginLogModel> | null> = new BehaviorSubject(null);
    constructor(private _httpClient: HttpClient) {
    }
    get listData$(): Observable<DataListModel<LoginLogModel>> {
        return this._listData.asObservable();
    }
    getDatas(query: QueryListModel): Observable<DataListModel<LoginLogModel>> {
        return this._httpClient.post<DataListModel<LoginLogModel>>(ENDPOINT.log.login, query).pipe(
            tap((response: any) => {
                this._listData.next(new DataListModel<LoginLogModel>(response, LoginLogModel));
            })
        );
    }
}
