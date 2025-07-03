import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENDPOINT } from 'app/constants/endpoint';
import { ApproveFormModel } from 'app/models/approve-form.model';
import { DataListModel } from 'app/models/data-list.model';
import { MinuteRequestListModel, MinuteRequestModel } from 'app/models/minute-request.model';
import { QueryListModel } from 'app/models/query-list.model';
import { BehaviorSubject, Observable, of, switchMap, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MinuteApproveService {
    private _listData: BehaviorSubject<DataListModel<MinuteRequestListModel> | null> = new BehaviorSubject(null);
    private _data: BehaviorSubject<MinuteRequestModel | null> = new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) {
    }
    get listData$(): Observable<DataListModel<MinuteRequestListModel>> {
        return this._listData.asObservable();
    }
    get data$(): Observable<MinuteRequestModel> {
        return this._data.asObservable();
    }


    getDatas(query: QueryListModel): Observable<DataListModel<MinuteRequestListModel>> {
        return this._httpClient.post<DataListModel<MinuteRequestListModel>>(ENDPOINT.minuteApprove.myApprove, query).pipe(
            tap((response: any) => {
                this._listData.next(new DataListModel<MinuteRequestListModel>(response, MinuteRequestListModel));
            })
        );
    }
    getData(id: string): Observable<MinuteRequestModel> {
        return this._httpClient.post<MinuteRequestModel>(`${ENDPOINT.minuteApprove.get}/${id}`, null).pipe(
            switchMap((response: any) => of(new MinuteRequestModel(response))),
            tap((response: MinuteRequestModel) => {
                this._data.next(new MinuteRequestModel(response));
            })
        );
    }
    approve(postData: ApproveFormModel): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.minuteApprove.approve}`, postData);
    }

}
