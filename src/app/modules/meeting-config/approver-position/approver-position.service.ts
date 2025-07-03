import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, switchMap, tap } from 'rxjs';
import { DataListModel } from 'app/models/data-list.model';
import { ENDPOINT } from 'app/constants/endpoint';
import { QueryListModel } from 'app/models/query-list.model';
import { ApproverPositionModel } from 'app/models/standard.model';

@Injectable({
    providedIn: 'root'
})
export class ApproverPositionService {
    private _listData: BehaviorSubject<DataListModel<ApproverPositionModel> | null> = new BehaviorSubject(null);
    private _data: BehaviorSubject<ApproverPositionModel | null> = new BehaviorSubject(null);
    constructor(private _httpClient: HttpClient) {
    }
    get listData$(): Observable<DataListModel<ApproverPositionModel>> {
        return this._listData.asObservable();
    }
    get data$(): Observable<ApproverPositionModel> {
        return this._data.asObservable();
    }

    getDatas(query: QueryListModel): Observable<DataListModel<ApproverPositionModel>> {
        return this._httpClient.post<DataListModel<ApproverPositionModel>>(ENDPOINT.approverPosition.search, query).pipe(
            tap((response: any) => {
                this._listData.next(new DataListModel<ApproverPositionModel>(response, ApproverPositionModel));
            })
        );
    }
    getData(id: number): Observable<ApproverPositionModel> {
        return this._httpClient.post<ApproverPositionModel>(`${ENDPOINT.approverPosition.get}/${id}`, null).pipe(
            switchMap((response: any) => of(new ApproverPositionModel(response))),
            tap((response: ApproverPositionModel) => {
                this._data.next(new ApproverPositionModel(response));
            })
        );
    }
    create(postData: ApproverPositionModel): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.approverPosition.add}`, postData);
    }
    update(postData: ApproverPositionModel): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.approverPosition.update}`, postData);
    }
    delete(id: number): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.approverPosition.delete}/${id}`, id);
    }

}
