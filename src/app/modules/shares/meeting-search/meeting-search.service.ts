import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, take, tap } from 'rxjs';
import { DataListModel } from 'app/models/data-list.model';
import { GlobalService } from 'app/services/global.service';
import { ENDPOINT } from 'app/constants/endpoint';
import { SuccessModel } from 'app/models/success.model';
import { QueryListModel } from 'app/models/query-list.model';
import { MeetingListModel } from 'app/models/meeting.model';


@Injectable({
    providedIn: 'root'
})
export class MeetingSearchService {
    private _listData: BehaviorSubject<DataListModel<MeetingListModel> | null> = new BehaviorSubject(null);
    constructor(private _httpClient: HttpClient, private _globalService: GlobalService) {
    }
    get listData$(): Observable<DataListModel<MeetingListModel>> {
        return this._listData.asObservable();
    }

    getDatas(query: QueryListModel): Observable<DataListModel<MeetingListModel>> {
        return this._httpClient.post<DataListModel<MeetingListModel>>(ENDPOINT.meeting.search, query).pipe(
            tap((response: any) => {
                this._listData.next(new DataListModel<MeetingListModel>(response, MeetingListModel));
            })
        );
    }

    clearData(): void {
        this._listData.next(null);
    }
}
