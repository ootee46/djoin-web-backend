import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of,  tap } from 'rxjs';
import { GlobalService } from 'app/services/global.service';
import { ENDPOINT } from 'app/constants/endpoint';
import { SuccessModel } from 'app/models/success.model';
import { QueryListModel } from 'app/models/query-list.model';
import { MeetingAttendeeFormModel, MeetingAttendeeModel } from 'app/models/attendee.model';
import { MemberGroupModel } from 'app/models/member-group.model';
import { StandardModel } from 'app/models/standard.model';
import { UserModel } from 'app/models/user.model';

@Injectable({
    providedIn: 'root'
})
export class AttendeeService {
    private _datas: BehaviorSubject<MeetingAttendeeModel[] | null> = new BehaviorSubject(null);
    private _data: BehaviorSubject<MeetingAttendeeModel | null> = new BehaviorSubject(null);
    private _users: BehaviorSubject<UserModel[] | null> = new BehaviorSubject(null);
    private _userGroups: BehaviorSubject<StandardModel[] | null> = new BehaviorSubject(null);
    constructor(private _httpClient: HttpClient, private _globalService: GlobalService) {

    }
    get datas$(): Observable<MeetingAttendeeModel[]> {
        return this._datas.asObservable();
    }
    get data$(): Observable<MeetingAttendeeModel> {
        return this._data.asObservable();
    }
    get users$(): Observable<UserModel[]> {
        return this._users.asObservable();
    }
    get userGroups$(): Observable<StandardModel[]> {
        return this._userGroups.asObservable();
    }

    getDatas(id: string): Observable<MeetingAttendeeModel[]> {
        return this._httpClient.post<MeetingAttendeeModel[]>(ENDPOINT.meetingAttendee.search.concat('/').concat(id),null).pipe(
            tap((response: any) => {
                this._datas.next(response.map(c=>new MeetingAttendeeModel(c)));
            })
        );
    }
    getData(id: number): Observable<MeetingAttendeeModel[]> {
        return this._httpClient.post<MeetingAttendeeModel[]>(`${ENDPOINT.meetingAttendee.get}/${id}`,null).pipe(
            tap((response: any) => {
                 this._data.next(new MeetingAttendeeModel(response));
            })
        );
    }
    getUser(id: string): Observable<UserModel[]> {
        if(id){
            return this._httpClient.post<UserModel[]>(ENDPOINT.user.getAll.concat('/').concat(id) ,null).pipe(
                tap((response: any) => {
                    let datas = response.map((c: UserModel)=>new UserModel(c));
                    const existUsers = this._datas.getValue().map(c=>c.userId);
                    datas = datas.filter(c=>existUsers.find(a=>a === c.id) == null);
                    this._users.next(datas);
                })
            );
        }else{
            return this._httpClient.post<UserModel[]>(ENDPOINT.user.getAll ,null).pipe(
                tap((response: any) => {
                    let datas = response.map((c: UserModel)=>new UserModel(c));
                    const existUsers = this._datas.getValue().map(c=>c.userId);
                    datas = datas.filter(c=>existUsers.find(a=>a === c.id) == null);
                    this._users.next(datas);
                })
            );
        }

    }
    getUserGroup(): Observable<StandardModel[]> {
        return this._httpClient.post<StandardModel[]>(ENDPOINT.common.userGroup,null).pipe(
            tap((response: any) => {
                this._userGroups.next(response.map((c: StandardModel)=>new StandardModel(c)));
            })
        );
    }
    create(postData: MeetingAttendeeFormModel): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.meetingAttendee.add}`,postData);
    }

    setChirman(id: number): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.meetingAttendee.setChirman}/${id}`,null);
    }

    removeChirman(id: number): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.meetingAttendee.removeChirman}/${id}`,null);
    }

    setSecretary(id: number): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.meetingAttendee.setSecretary}/${id}`,null);
    }

    removeSecretary(id: number): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.meetingAttendee.removeSecretary}/${id}`,null);
    }


    update(postData: MeetingAttendeeFormModel): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.meetingAttendee.update}`,postData);
    }
    delete(id: number): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.meetingAttendee.delete}/${id}`,id);
    }

}
