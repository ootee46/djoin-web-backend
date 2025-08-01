import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of,  tap } from 'rxjs';
import { DataListModel } from 'app/models/data-list.model';
import { GlobalService } from 'app/services/global.service';
import { ENDPOINT } from 'app/constants/endpoint';
import { SuccessModel } from 'app/models/success.model';
import { QueryListModel } from 'app/models/query-list.model';
import { AgendaModel } from 'app/models/agenda.model';
import { MemberUserModel } from 'app/models/member-user.model';

@Injectable({
    providedIn: 'root'
})
export class DocumentUploadService {
    private _listData: BehaviorSubject<AgendaModel[] | null> = new BehaviorSubject(null);
    private _data: BehaviorSubject<AgendaModel | null> = new BehaviorSubject(null);
    private _adminUsers: BehaviorSubject<MemberUserModel[] | null> = new BehaviorSubject(null);
    constructor(private _httpClient: HttpClient, private _globalService: GlobalService) {
    }
    get listData$(): Observable<AgendaModel[]> {
        return this._listData.asObservable();
    }
    get data$(): Observable<AgendaModel> {
        return this._data.asObservable();
    }
    get adminUsers$(): Observable<MemberUserModel[]> {
        return this._adminUsers.asObservable();
    }

    getDatas(query: QueryListModel): Observable<AgendaModel[]> {
        return this._httpClient.post<AgendaModel[]>(ENDPOINT.meetingAgenda.search , query).pipe(
            tap((response: any) => {
                this._listData.next(response.map(c=>new AgendaModel(c)));
            })
        );
    }
    getData(id: number): Observable<AgendaModel[]> {
        return this._httpClient.post<AgendaModel[]>(`${ENDPOINT.meetingAgenda.get}/${id}`,null).pipe(
            tap((response: any) => {
                 this._data.next(new AgendaModel(response));
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
        return this._httpClient.post<AgendaModel>(`${ENDPOINT.meetingAgenda.add}`,postData).pipe(
            tap((response: any) => {
                 this._data.next(new AgendaModel(response));
            })
        );
    }
    update(postData: AgendaModel): Observable<AgendaModel> {
        return this._httpClient.post<AgendaModel>(`${ENDPOINT.meetingAgenda.update}`,postData).pipe(
            tap((response: any) => {
                 this._data.next(new AgendaModel(response));
            })
        );
    }

    delete(id: number): Observable<SuccessModel[]> {
        return this._httpClient.post<SuccessModel[]>(`${ENDPOINT.meetingAgenda.delete}/${id}`,id);
    }

}
