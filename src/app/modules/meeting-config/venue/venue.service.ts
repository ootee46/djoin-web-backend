import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, switchMap, tap } from 'rxjs';
import { DataListModel } from 'app/models/data-list.model';
import { ENDPOINT } from 'app/constants/endpoint';
import { QueryListModel } from 'app/models/query-list.model';
import { StandardModel, StandardFormModel } from 'app/models/standard.model';

@Injectable({
    providedIn: 'root'
})
export class VenueService {
    private _listData: BehaviorSubject<DataListModel<StandardModel> | null> = new BehaviorSubject(null);
    private _data: BehaviorSubject<StandardModel | null> = new BehaviorSubject(null);
    constructor(private _httpClient: HttpClient) {
    }
    get listData$(): Observable<DataListModel<StandardModel>> {
        return this._listData.asObservable();
    }
    get data$(): Observable<StandardModel> {
        return this._data.asObservable();
    }

    getDatas(query: QueryListModel): Observable<DataListModel<StandardModel>> {
        return this._httpClient.post<DataListModel<StandardModel>>(ENDPOINT.venue.search, query).pipe(
            tap((response: any) => {
                this._listData.next(new DataListModel<StandardModel>(response, StandardModel));
            }),
            switchMap((response: any) => of(new DataListModel<StandardModel>(response, StandardModel))),
        );
    }
    getData(id: number): Observable<StandardModel> {
        return this._httpClient.post<StandardModel>(`${ENDPOINT.venue.get}/${id}`, null).pipe(
            switchMap((response: any) => of(new StandardModel(response))),
            tap((response: StandardModel) => {
                this._data.next(new StandardModel(response));
            })
        );
    }
    create(postData: StandardFormModel): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.venue.add}`, postData);
    }
    update(postData: StandardFormModel): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.venue.update}`, postData);
    }
    delete(id: number): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.venue.delete}/${id}`, id);
    }

}
