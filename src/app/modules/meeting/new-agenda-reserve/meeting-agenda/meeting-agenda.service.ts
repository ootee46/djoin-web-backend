import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of,  tap } from 'rxjs';
import { DataListModel } from 'app/models/data-list.model';
import { GlobalService } from 'app/services/global.service';
import { ENDPOINT } from 'app/constants/endpoint';
import { SuccessModel } from 'app/models/success.model';
import { QueryListModel } from 'app/models/query-list.model';
import { MemberUserModel } from 'app/models/member-user.model';
import { MeetingMgmModel } from 'app/models/meeting-mgm.model';
import { AgendaModel } from 'app/models/agenda.model';

@Injectable({
    providedIn: 'root'
})
export class MeetingAgendaService {
    private _data: BehaviorSubject<AgendaModel | null> = new BehaviorSubject(null);
    private _adminUsers: BehaviorSubject<MemberUserModel[] | null> = new BehaviorSubject(null);
    private _datas: BehaviorSubject<AgendaModel[] | null> = new BehaviorSubject(null);
    private _agendas: BehaviorSubject<AgendaModel[] | null> = new BehaviorSubject(null);
    constructor(private _httpClient: HttpClient, private _globalService: GlobalService) {
    }

    get data$(): Observable<AgendaModel> {
        return this._data.asObservable();
    }
    get adminUsers$(): Observable<MemberUserModel[]> {
        return this._adminUsers.asObservable();
    }
    get datas$(): Observable<AgendaModel[]> {
        return this._datas.asObservable();
    }
    get agendas$(): Observable<AgendaModel[]> {
        return this._agendas.asObservable();
    }

    getDatas(query: QueryListModel): Observable<DataListModel<AgendaModel>> {
        return this._httpClient.post<DataListModel<AgendaModel>>(ENDPOINT.meetingAgenda.search , query).pipe(
            tap((response: any) => {
                this._datas.next(response.map((c: AgendaModel)=>new AgendaModel(c)));
            })
        );
    }
    getData(id: number): Observable<AgendaModel[]> {
        return this._httpClient.post<AgendaModel[]>(`${ENDPOINT.agendaRequest.get}/${id}`,null).pipe(
            tap((response: any) => {
                 this._data.next(new AgendaModel(response));
            })
        );
    }
    getAgendas(query: QueryListModel): Observable<DataListModel<AgendaModel>> {
        return this._httpClient.post<DataListModel<AgendaModel>>(ENDPOINT.meetingAgenda.search , query).pipe(
            tap((response: any) => {
                this._agendas.next(response.map((c: AgendaModel)=>new AgendaModel(c)));
            })
        );
    }
    getAdminUser(): Observable<MemberUserModel[]> {
        return this._httpClient.post<MemberUserModel[]>(ENDPOINT.user.getAll ,null).pipe(
            tap((response: any) => {
                this._adminUsers.next(response.map((c: MemberUserModel)=>new MemberUserModel(c)));
            })
        );
    }

    create(postData: AgendaModel): Observable<AgendaModel> {
        return this._httpClient.post<AgendaModel>(`${ENDPOINT.agendaRequest.add}`,postData).pipe(
            tap((response: any) => {
                 this._data.next(new AgendaModel(response));
            })
        );
    }
    update(postData: AgendaModel): Observable<AgendaModel> {
        return this._httpClient.post<AgendaModel>(`${ENDPOINT.agendaRequest.update}`,postData).pipe(
            tap((response: any) => {
                 this._data.next(new AgendaModel(response));
            })
        );
    }

    delete(id: number): Observable<SuccessModel[]> {
        return this._httpClient.post<SuccessModel[]>(`${ENDPOINT.agendaRequest.delete}/${id}`,id);
    }

}
