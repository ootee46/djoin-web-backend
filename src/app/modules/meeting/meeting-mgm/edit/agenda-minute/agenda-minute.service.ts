import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENDPOINT } from 'app/constants/endpoint';
import { MeetingAgendaModel } from 'app/models/meeting-agenda.model';
import { MemberUserModel } from 'app/models/member-user.model';
import { MinuteRequestFormModel, MinuteRequestModel } from 'app/models/minute-request.model';
import { MinuteConfirmFormModel, MinuteConfirmModel, MinuteFormModel, MinuteHistoryModel } from 'app/models/minute.model';
import { GlobalService } from 'app/services/global.service';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AgendaMinuteService {
    private _listData: BehaviorSubject<MeetingAgendaModel[] | null> = new BehaviorSubject(null);
    private _data: BehaviorSubject<MinuteRequestModel | null> = new BehaviorSubject(null);
    private _adminUsers: BehaviorSubject<MemberUserModel[] | null> = new BehaviorSubject(null);
    private _minuteHistories: BehaviorSubject<MinuteHistoryModel[] | null> = new BehaviorSubject([]);
    private _minuteConfirms: BehaviorSubject<MinuteConfirmModel[] | null> = new BehaviorSubject([]);
    constructor(private _httpClient: HttpClient, private _globalService: GlobalService) {
    }
    get listData$(): Observable<MeetingAgendaModel[]> {
        return this._listData.asObservable();
    }
    get data$(): Observable<MinuteRequestModel> {
        return this._data.asObservable();
    }
    get adminUsers$(): Observable<MemberUserModel[]> {
        return this._adminUsers.asObservable();
    }
    get minuteHistories$(): Observable<MinuteHistoryModel[]> {
        return this._minuteHistories.asObservable();
    }
    get minuteConfirms$(): Observable<MinuteConfirmModel[]> {
        return this._minuteConfirms.asObservable();
    }


    getDatas(id: number): Observable<MeetingAgendaModel[]> {
        return this._httpClient.post<MeetingAgendaModel[]>(`${ENDPOINT.meetingAgenda.agendaMeetingReserveGet}/${id}`, null).pipe(
            tap((response: any) => {
                this._listData.next(response.map(c => new MeetingAgendaModel(c)));
            })
        );
    }
    getData(id: number): Observable<MinuteRequestModel> {
        return this._httpClient.post<MinuteRequestModel>(`${ENDPOINT.minuteRequest.get}/${id}`, null).pipe(
            tap((response: any) => {
                this._data.next(new MinuteRequestModel(response));
            })
        );
    }
    getAdminUser(): Observable<MemberUserModel[]> {
        return this._httpClient.post<MemberUserModel[]>(ENDPOINT.user.getAll, null).pipe(
            tap((response: any) => {
                this._adminUsers.next(response.map((c: MemberUserModel) => new MemberUserModel(c)));
            })
        );
    }
    submit(postData: MinuteRequestFormModel): Observable<MinuteRequestFormModel> {
        return this._httpClient.post<MinuteRequestFormModel>(`${ENDPOINT.minuteRequest.submit}`, postData);
    }
    getMinuteHistory(id: number): Observable<MinuteHistoryModel[]> {
        return this._httpClient.post<MinuteHistoryModel[]>(`${ENDPOINT.minute.getHistory}/${id}`, null).pipe(
            tap((response: any) => {
                this._minuteHistories.next(response.map((c: MinuteHistoryModel) => new MinuteHistoryModel(c)));
            })
        );
    }
    getMinuteConfirm(id: number): Observable<MinuteConfirmModel[]> {
        return this._httpClient.post<MinuteConfirmModel[]>(`${ENDPOINT.minute.getConfirm}/${id}`, null).pipe(
            tap((response: any) => {
                this._minuteConfirms.next(response.map((c: MinuteConfirmModel) => new MinuteConfirmModel(c)));
            })
        );
    }

    minuteAdd(postData: MinuteFormModel): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.minute.add}`, postData);
    }

    sendMinuteConfirm(postData: MinuteConfirmFormModel): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.minute.sendConfirm}`, postData);
    }

}
