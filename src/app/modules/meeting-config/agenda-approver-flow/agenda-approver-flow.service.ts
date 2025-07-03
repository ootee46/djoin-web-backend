import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, switchMap, tap } from 'rxjs';
import { DataListModel } from 'app/models/data-list.model';
import { ENDPOINT } from 'app/constants/endpoint';
import { QueryListModel } from 'app/models/query-list.model';
import { AgendaApproverFlowModel } from 'app/models/standard.model';

@Injectable({
    providedIn: 'root'
})
export class AgendaApproverFlowService {
    private _listData: BehaviorSubject<DataListModel<AgendaApproverFlowModel> | null> = new BehaviorSubject(null);
    private _data: BehaviorSubject<AgendaApproverFlowModel | null> = new BehaviorSubject(null);
    constructor(private _httpClient: HttpClient) {
    }
    get listData$(): Observable<DataListModel<AgendaApproverFlowModel>> {
        return this._listData.asObservable();
    }
    get data$(): Observable<AgendaApproverFlowModel> {
        return this._data.asObservable();
    }

    getDatas(query: QueryListModel): Observable<DataListModel<AgendaApproverFlowModel>> {
        return this._httpClient.post<DataListModel<AgendaApproverFlowModel>>(ENDPOINT.agendaApprover.search, query).pipe(
            tap((response: any) => {
                this._listData.next(new DataListModel<AgendaApproverFlowModel>(response, AgendaApproverFlowModel));
            })
        );
    }
    getData(id: number): Observable<AgendaApproverFlowModel> {
        return this._httpClient.post<AgendaApproverFlowModel>(`${ENDPOINT.agendaApprover.get}/${id}`, null).pipe(
            switchMap((response: any) => of(new AgendaApproverFlowModel(response))),
            tap((response: AgendaApproverFlowModel) => {
                this._data.next(new AgendaApproverFlowModel(response));
            })
        );
    }
    create(postData: AgendaApproverFlowModel): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.agendaApprover.add}`, postData);
    }
    update(postData: AgendaApproverFlowModel): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.agendaApprover.update}`, postData);
    }
    delete(id: number): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.agendaApprover.delete}/${id}`, id);
    }

}
