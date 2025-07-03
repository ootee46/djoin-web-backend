import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENDPOINT } from 'app/constants/endpoint';
import { DataListModel } from 'app/models/data-list.model';
import { ErrorLogModel } from 'app/models/error-log.model';
import { QueryListModel } from 'app/models/query-list.model';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ErrorLogService {
    private _listData: BehaviorSubject<DataListModel<ErrorLogModel> | null> = new BehaviorSubject(null);
    constructor(private _httpClient: HttpClient) {
    }
    get listData$(): Observable<DataListModel<ErrorLogModel>> {
        return this._listData.asObservable();
    }
    getDatas(query: QueryListModel): Observable<DataListModel<ErrorLogModel>> {
        return this._httpClient.post<DataListModel<ErrorLogModel>>(ENDPOINT.log.error, query).pipe(
            tap((response: any) => {
                this._listData.next(new DataListModel<ErrorLogModel>(response, ErrorLogModel));
            })
        );
    }
}
