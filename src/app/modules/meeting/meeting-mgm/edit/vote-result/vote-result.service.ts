import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of,  tap } from 'rxjs';
import { GlobalService } from 'app/services/global.service';
import { ENDPOINT } from 'app/constants/endpoint';
import { SuccessModel } from 'app/models/success.model';
import { QueryListModel } from 'app/models/query-list.model';
import { MemberUserModel } from 'app/models/member-user.model';
import { MeetingAgendaModel } from 'app/models/meeting-agenda.model';
import { VoteResultModel } from 'app/models/vote-result.model';

@Injectable({
    providedIn: 'root'
})
export class VoteResultService {
    private _listData: BehaviorSubject<MeetingAgendaModel[] | null> = new BehaviorSubject(null);
    private _data: BehaviorSubject<MeetingAgendaModel | null> = new BehaviorSubject(null);
    private _adminUsers: BehaviorSubject<MemberUserModel[] | null> = new BehaviorSubject(null);
    private _voteResults: BehaviorSubject<VoteResultModel[] | null> = new BehaviorSubject(null);
    constructor(private _httpClient: HttpClient, private _globalService: GlobalService) {
    }
    get listData$(): Observable<MeetingAgendaModel[]> {
        return this._listData.asObservable();
    }
    get data$(): Observable<MeetingAgendaModel> {
        return this._data.asObservable();
    }
    get adminUsers$(): Observable<MemberUserModel[]> {
        return this._adminUsers.asObservable();
    }
    get voteResults$(): Observable<VoteResultModel[]> {
        return this._voteResults.asObservable();
    }


    getVoteResult(id: number): Observable<VoteResultModel[]> {
        return this._httpClient.post<VoteResultModel[]>(`${ENDPOINT.meetingAgenda.getVote}/${id}` , null).pipe(
            tap((response: any) => {
                this._voteResults.next(response.map(c=>new VoteResultModel(c)));
            })
        );
    }

    getDatas(query: QueryListModel): Observable<MeetingAgendaModel[]> {
        return this._httpClient.post<MeetingAgendaModel[]>(ENDPOINT.meetingAgenda.search , query).pipe(
            tap((response: any) => {
                this._listData.next(response.map(c=>new MeetingAgendaModel(c)));
            })
        );
    }
    getData(id: number): Observable<MeetingAgendaModel[]> {
        return this._httpClient.post<MeetingAgendaModel[]>(`${ENDPOINT.meetingAgenda.get}/${id}`,null).pipe(
            tap((response: any) => {
                 this._data.next(new MeetingAgendaModel(response));
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
    create(postData: MeetingAgendaModel): Observable<MeetingAgendaModel> {
        return this._httpClient.post<MeetingAgendaModel>(`${ENDPOINT.meetingAgenda.add}`,postData).pipe(
            tap((response: any) => {
                 this._data.next(new MeetingAgendaModel(response));
            })
        );
    }
    update(postData: MeetingAgendaModel): Observable<MeetingAgendaModel> {
        return this._httpClient.post<MeetingAgendaModel>(`${ENDPOINT.meetingAgenda.update}`,postData).pipe(
            tap((response: any) => {
                 this._data.next(new MeetingAgendaModel(response));
            })
        );
    }

    delete(id: number): Observable<SuccessModel[]> {
        return this._httpClient.post<SuccessModel[]>(`${ENDPOINT.meetingAgenda.delete}/${id}`,id);
    }

}
