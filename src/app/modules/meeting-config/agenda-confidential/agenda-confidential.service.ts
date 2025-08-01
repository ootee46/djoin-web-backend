import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, switchMap, tap } from 'rxjs';
import { DataListModel } from 'app/models/data-list.model';
import { ENDPOINT } from 'app/constants/endpoint';
import { QueryListModel } from 'app/models/query-list.model';
import { AgendaConfidentialModel } from 'app/models/standard.model';

@Injectable({
    providedIn: 'root'
})
export class AgendaConfidentialService {
    private _listData: BehaviorSubject<DataListModel<AgendaConfidentialModel> | null> = new BehaviorSubject(null);
    private _data: BehaviorSubject<AgendaConfidentialModel | null> = new BehaviorSubject(null);
    constructor(private _httpClient: HttpClient) {
    }
    get listData$(): Observable<DataListModel<AgendaConfidentialModel>> {
        return this._listData.asObservable();
    }
    get data$(): Observable<AgendaConfidentialModel> {
        return this._data.asObservable();
    }

    getDatas(query: QueryListModel): Observable<DataListModel<AgendaConfidentialModel>> {
        return this._httpClient.post<DataListModel<AgendaConfidentialModel>>(ENDPOINT.agendaConfidential.search, query).pipe(
            tap((response: any) => {
                this._listData.next(new DataListModel<AgendaConfidentialModel>(response, AgendaConfidentialModel));
            })
        );
    }
    getData(id: number): Observable<AgendaConfidentialModel> {
        return this._httpClient.post<AgendaConfidentialModel>(`${ENDPOINT.agendaConfidential.get}/${id}`, null).pipe(
            switchMap((response: any) => of(new AgendaConfidentialModel(response))),
            tap((response: AgendaConfidentialModel) => {
                this._data.next(new AgendaConfidentialModel(response));
            })
        );
    }
    create(postData: AgendaConfidentialModel): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.agendaConfidential.add}`, postData);
    }
    update(postData: AgendaConfidentialModel): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.agendaConfidential.update}`, postData);
    }
    delete(id: number): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.agendaConfidential.delete}/${id}`, id);
    }

}
