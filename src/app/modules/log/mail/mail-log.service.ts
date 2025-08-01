import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENDPOINT } from 'app/constants/endpoint';
import { DataListModel } from 'app/models/data-list.model';
import { MailLogModel } from 'app/models/mail-log.model';
import { QueryListModel } from 'app/models/query-list.model';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MailLogService {
    private _listData: BehaviorSubject<DataListModel<MailLogModel> | null> = new BehaviorSubject(null);
    constructor(private _httpClient: HttpClient) {
    }
    get listData$(): Observable<DataListModel<MailLogModel>> {
        return this._listData.asObservable();
    }
    getDatas(query: QueryListModel): Observable<DataListModel<MailLogModel>> {
        return this._httpClient.post<DataListModel<MailLogModel>>(ENDPOINT.log.mail, query).pipe(
            tap((response: any) => {
                this._listData.next(new DataListModel<MailLogModel>(response, MailLogModel));
            })
        );
    }
}
