import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of,  tap } from 'rxjs';
import { DataListModel } from 'app/models/data-list.model';
import { UserModel } from 'app/models/user.model';
import { GlobalService } from 'app/services/global.service';
import { ENDPOINT } from 'app/constants/endpoint';
import { SuccessModel } from 'app/models/success.model';
import { QueryListModel } from 'app/models/query-list.model';
import { UserFormModel } from 'app/models/user-form.model';
import { MeetingRoomModel } from 'app/models/meeting-room.model';
import { UserGroupModel } from 'app/models/user-group.model';
import { ApproverPositionModel } from 'app/models/standard.model';

@Injectable({
    providedIn: 'root'
})
export class UserDataService {
    private _listData: BehaviorSubject<DataListModel<UserModel> | null> = new BehaviorSubject(null);
    private _data: BehaviorSubject<UserModel | null> = new BehaviorSubject(null);
    private _meetingRooms: BehaviorSubject<MeetingRoomModel[] | null> = new BehaviorSubject(null);
    private _userGroups: BehaviorSubject<UserGroupModel[] | null> = new BehaviorSubject(null);
    private _users: BehaviorSubject<UserModel[] | null> = new BehaviorSubject(null);
    private _approverPositions: BehaviorSubject<ApproverPositionModel[] | null> = new BehaviorSubject(null);
    constructor(private _httpClient: HttpClient) {
    }
    get listData$(): Observable<DataListModel<UserModel>> {
        return this._listData.asObservable();
    }
    get data$(): Observable<UserModel> {
        return this._data.asObservable();
    }

    get meetingRooms$(): Observable<MeetingRoomModel[]> {
        return this._meetingRooms.asObservable();
    }

    get userGroups$(): Observable<UserGroupModel[]> {
        return this._userGroups.asObservable();
    }

    get users$(): Observable<UserModel[]> {
        return this._users.asObservable();
    }

    get approverPositions$(): Observable<ApproverPositionModel[]> {
        return this._approverPositions.asObservable();
    }


    getDatas(query: QueryListModel): Observable<DataListModel<UserModel>> {
        return this._httpClient.post<DataListModel<UserModel>>(ENDPOINT.user.search , query).pipe(
            tap((response: any) => {
                this._listData.next(new DataListModel<UserModel>(response,UserModel));
            })
        );
    }
    getData(id: number): Observable<UserModel> {
        return this._httpClient.post<UserModel>(`${ENDPOINT.user.get}/${id}`,null).pipe(
            tap((response: any) => {
                 this._data.next(new UserModel(response));
            })
        );
    }
    getMeetingRoom(): Observable<MeetingRoomModel[]> {
        return this._httpClient.post<MeetingRoomModel[]>(ENDPOINT.meetingRoom.getAll , null).pipe(
            tap((response: any) => {
                this._meetingRooms.next(response.map(c=>new MeetingRoomModel(c)));
            })
        );
    }

    getApproverPosition(): Observable<ApproverPositionModel[]> {
        return this._httpClient.post<ApproverPositionModel[]>(ENDPOINT.common.approverPosition , null).pipe(
            tap((response: any) => {
                this._approverPositions.next(response.map(c=>new ApproverPositionModel(c)));
            })
        );
    }

    getUsers(): Observable<UserModel[]> {
        return this._httpClient.post<UserModel[]>(ENDPOINT.common.systemUser , null).pipe(
            tap((response: any) => {
                this._users.next(response.map(c=>new UserModel(c)));
            })
        );
    }

    getUserGroup(): Observable<UserGroupModel[]> {
        return this._httpClient.post<UserGroupModel[]>(ENDPOINT.userGroup.getAll , null).pipe(
            tap((response: any) => {
                this._userGroups.next(response.map(c=>new UserGroupModel(c)));
            })
        );
    }
    create(postData: UserFormModel): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.user.add}`,postData);
    }
    update(postData: UserFormModel): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.user.update}`, postData);
    }
    delete(id: number): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.user.delete}/${id}`,id);
    }

}
