import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, switchMap, tap } from 'rxjs';
import { DataListModel } from 'app/models/data-list.model';
import { ENDPOINT } from 'app/constants/endpoint';
import { QueryListModel } from 'app/models/query-list.model';
import { AgendaObjectiveModel } from 'app/models/standard.model';

@Injectable({
    providedIn: 'root'
})
export class AgendaObjectiveService {
    private _listData: BehaviorSubject<DataListModel<AgendaObjectiveModel> | null> = new BehaviorSubject(null);
    private _data: BehaviorSubject<AgendaObjectiveModel | null> = new BehaviorSubject(null);
    constructor(private _httpClient: HttpClient) {
    }
    get listData$(): Observable<DataListModel<AgendaObjectiveModel>> {
        return this._listData.asObservable();
    }
    get data$(): Observable<AgendaObjectiveModel> {
        return this._data.asObservable();
    }

    getDatas(query: QueryListModel): Observable<DataListModel<AgendaObjectiveModel>> {
        return this._httpClient.post<DataListModel<AgendaObjectiveModel>>(ENDPOINT.agendaObjective.search, query).pipe(
            tap((response: any) => {
                this._listData.next(new DataListModel<AgendaObjectiveModel>(response, AgendaObjectiveModel));
            })
        );
    }
    getData(id: number): Observable<AgendaObjectiveModel> {
        return this._httpClient.post<AgendaObjectiveModel>(`${ENDPOINT.agendaObjective.get}/${id}`, null).pipe(
            switchMap((response: any) => of(new AgendaObjectiveModel(response))),
            tap((response: AgendaObjectiveModel) => {
                this._data.next(new AgendaObjectiveModel(response));
            })
        );
    }
    create(postData: AgendaObjectiveModel): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.agendaObjective.add}`, postData);
    }
    update(postData: AgendaObjectiveModel): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.agendaObjective.update}`, postData);
    }
    delete(id: number): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.agendaObjective.delete}/${id}`, id);
    }

}
