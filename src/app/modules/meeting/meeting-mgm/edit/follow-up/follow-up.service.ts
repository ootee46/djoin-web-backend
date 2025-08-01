import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of,  switchMap,  tap } from 'rxjs';
import { GlobalService } from 'app/services/global.service';
import { ENDPOINT } from 'app/constants/endpoint';
import { SuccessModel } from 'app/models/success.model';
import { QueryListModel } from 'app/models/query-list.model';
import { FollowUpFormModel, FollowUpModel } from 'app/models/follow-up.model';
import { MemberUserModel } from 'app/models/member-user.model';
import { DataListModel } from 'app/models/data-list.model';

@Injectable({
    providedIn: 'root'
})
export class FollowUpService {
    private _listData: BehaviorSubject<DataListModel<FollowUpModel> | null> = new BehaviorSubject(null);
    private _data: BehaviorSubject<FollowUpModel | null> = new BehaviorSubject(null);
    constructor(private _httpClient: HttpClient, private _globalService: GlobalService) {
    }
    get listData$(): Observable<DataListModel<FollowUpModel>> {
        return this._listData.asObservable();
    }
    get data$(): Observable<FollowUpModel> {
        return this._data.asObservable();
    }
    getDatas(query: QueryListModel): Observable<DataListModel<FollowUpModel>> {
        return this._httpClient.post<DataListModel<FollowUpModel[]>>(ENDPOINT.followUp.search,query).pipe(
            tap((response: any) => {
                this._listData.next(new DataListModel<FollowUpModel>(response, FollowUpModel));
            })
        );
    }
    getData(id: number): Observable<FollowUpModel> {
        return this._httpClient.post<FollowUpModel>(`${ENDPOINT.followUp.get}/${id}`,null).pipe(
            switchMap((response: any) => (response? of(new FollowUpModel(response)) : of(null))),
            tap((response: any) => {
                 this._data.next(new FollowUpModel(response));
            }),
        );
    }
    create(postData: FollowUpFormModel): Observable<any> {
        return this._httpClient.post<FollowUpFormModel>(`${ENDPOINT.followUp.add}`,postData);
    }
    update(postData: FollowUpFormModel): Observable<any> {
        return this._httpClient.post<FollowUpFormModel>(`${ENDPOINT.followUp.update}`,postData);
    }
    delete(id: number): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.followUp.delete}/${id}`,id);
    }

}
