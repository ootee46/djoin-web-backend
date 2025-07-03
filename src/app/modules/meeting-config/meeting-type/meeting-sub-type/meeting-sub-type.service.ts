import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, switchMap, tap } from 'rxjs';
import { DataListModel } from 'app/models/data-list.model';
import { ENDPOINT } from 'app/constants/endpoint';
import { QueryListModel } from 'app/models/query-list.model';
import { MeetingSubTypeModel, MeetingTypeModel } from 'app/models/standard.model';

@Injectable({
    providedIn: 'root'
})
export class MeetingSubTypeService {
    private _listData: BehaviorSubject<DataListModel<MeetingSubTypeModel> | null> = new BehaviorSubject(null);
    private _data: BehaviorSubject<MeetingSubTypeModel | null> = new BehaviorSubject(null);
    private _dataId: number = 0;
    private _catData: MeetingTypeModel = new MeetingTypeModel({});
    constructor(private _httpClient: HttpClient) {
    }
    get listData$(): Observable<DataListModel<MeetingSubTypeModel>> {
        return this._listData.asObservable();
    }
    get data$(): Observable<MeetingSubTypeModel> {
        return this._data.asObservable();
    }

    setDataId(id: number): void{
        this._dataId = id;
    }
    getDataId(): number{
        return this._dataId;
    }
    getCatData(): MeetingTypeModel{
        return this._catData;
    }

    getDatas(query: QueryListModel): Observable<DataListModel<MeetingSubTypeModel>> {
        return this._httpClient.post<DataListModel<MeetingSubTypeModel>>(ENDPOINT.meetingSubType.search, query).pipe(
            tap((response: any) => {
                this._listData.next(new DataListModel<MeetingSubTypeModel>(response, MeetingSubTypeModel));
            })
        );
    }
    getData(id: number): Observable<MeetingSubTypeModel> {
        return this._httpClient.post<MeetingSubTypeModel>(`${ENDPOINT.meetingSubType.get}/${id}`, null).pipe(
            switchMap((response: any) => of(new MeetingSubTypeModel(response))),
            tap((response: MeetingSubTypeModel) => {
                this._data.next(new MeetingSubTypeModel(response));
            })
        );
    }
    getDataCategory(id: number): Observable<MeetingTypeModel> {
        return this._httpClient.post<MeetingTypeModel>(`${ENDPOINT.meetingType.get}/${id}`, null).pipe(
            switchMap((response: any) => of(new MeetingTypeModel(response))),
            tap((response: MeetingTypeModel) => {
                this._catData = new MeetingTypeModel(response);
            })
        );
    }
    create(postData: MeetingSubTypeModel): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.meetingSubType.add}`, postData);
    }
    update(postData: MeetingSubTypeModel): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.meetingSubType.update}`, postData);
    }
    delete(id: number): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.meetingSubType.delete}/${id}`, id);
    }

}
