import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENDPOINT } from 'app/constants/endpoint';
import { DataListModel } from 'app/models/data-list.model';
import { DownloadLogModel } from 'app/models/download-log.model';
import { MemberUserModel } from 'app/models/member-user.model';
import { QueryListModel } from 'app/models/query-list.model';
import { GlobalService } from 'app/services/global.service';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FileOpenService {
    private _listData: BehaviorSubject<DataListModel<DownloadLogModel> | null> = new BehaviorSubject(null);
    private _adminUsers: BehaviorSubject<MemberUserModel[] | null> = new BehaviorSubject(null);
    constructor(private _httpClient: HttpClient, private _globalService: GlobalService) {
    }
    get listData$(): Observable<DataListModel<DownloadLogModel>> {
        return this._listData.asObservable();
    }

    getDatas(query: QueryListModel): Observable<DataListModel<DownloadLogModel[]>> {
        return this._httpClient.post<DataListModel<DownloadLogModel[]>>(ENDPOINT.downloadLog.search,query).pipe(
            tap((response: any) => {
                this._listData.next(new DataListModel<DownloadLogModel>(response, DownloadLogModel));
            })
        );
    }

}
