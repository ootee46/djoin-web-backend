import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, switchMap, tap } from 'rxjs';
import { DataListModel } from 'app/models/data-list.model';
import { ENDPOINT } from 'app/constants/endpoint';
import { QueryListModel } from 'app/models/query-list.model';
import { MeetingTypeModel } from 'app/models/standard.model';

@Injectable({
    providedIn: 'root'
})
export class MeetingTypeService {
    private _listData: BehaviorSubject<DataListModel<MeetingTypeModel> | null> = new BehaviorSubject(null);
    private _data: BehaviorSubject<MeetingTypeModel | null> = new BehaviorSubject(null);
    constructor(private _httpClient: HttpClient) {
    }
    get listData$(): Observable<DataListModel<MeetingTypeModel>> {
        return this._listData.asObservable();
    }
    get data$(): Observable<MeetingTypeModel> {
        return this._data.asObservable();
    }

    getDatas(query: QueryListModel): Observable<DataListModel<MeetingTypeModel>> {
        return this._httpClient.post<DataListModel<MeetingTypeModel>>(ENDPOINT.meetingType.search, query).pipe(
            tap((response: any) => {
                this._listData.next(new DataListModel<MeetingTypeModel>(response, MeetingTypeModel));
            })
        );
    }
    getData(id: number): Observable<MeetingTypeModel> {
        return this._httpClient.post<MeetingTypeModel>(`${ENDPOINT.meetingType.get}/${id}`, null).pipe(
            switchMap((response: any) => of(new MeetingTypeModel(response))),
            tap((response: MeetingTypeModel) => {
                this._data.next(new MeetingTypeModel(response));
            })
        );
    }
    create(postData: MeetingTypeModel): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.meetingType.add}`, postData);
    }
    update(postData: MeetingTypeModel): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.meetingType.update}`, postData);
    }
    delete(id: number): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.meetingType.delete}/${id}`, id);
    }

}
