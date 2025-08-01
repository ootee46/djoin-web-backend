import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENDPOINT } from 'app/constants/endpoint';
import { AgendaRequestItemListModel, AgendaRequestItemModel } from 'app/models/agenda-request.model';
import { ApproveFormModel } from 'app/models/approve-form.model';
import { DataListModel } from 'app/models/data-list.model';
import { QueryListModel } from 'app/models/query-list.model';
import { BehaviorSubject, Observable, of, switchMap, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AgendaApproveService {
    private _listData: BehaviorSubject<DataListModel<AgendaRequestItemListModel> | null> = new BehaviorSubject(null);
    private _data: BehaviorSubject<AgendaRequestItemModel | null> = new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) {
    }
    get listData$(): Observable<DataListModel<AgendaRequestItemListModel>> {
        return this._listData.asObservable();
    }
    get data$(): Observable<AgendaRequestItemModel> {
        return this._data.asObservable();
    }


    getDatas(query: QueryListModel): Observable<DataListModel<AgendaRequestItemListModel>> {
        return this._httpClient.post<DataListModel<AgendaRequestItemListModel>>(ENDPOINT.agendaApprove.myApprove, query).pipe(
            tap((response: any) => {
                this._listData.next(new DataListModel<AgendaRequestItemListModel>(response, AgendaRequestItemListModel));
            })
        );
    }
    getData(id: string): Observable<AgendaRequestItemModel> {
        return this._httpClient.post<AgendaRequestItemModel>(`${ENDPOINT.agendaApprove.get}/${id}`, null).pipe(
            switchMap((response: any) => of(new AgendaRequestItemModel(response))),
            tap((response: AgendaRequestItemModel) => {
                this._data.next(new AgendaRequestItemModel(response));
            })
        );
    }
    approve(postData: ApproveFormModel): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.agendaApprove.approve}`, postData);
    }
    approveCancel(postData: ApproveFormModel): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.agendaApprove.approveCancel}`, postData);
    }
    approveEdit(postData: ApproveFormModel): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.agendaApprove.approveEdit}`, postData);
    }

}
