import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, switchMap, tap } from 'rxjs';
import { DataListModel } from 'app/models/data-list.model';
import { GlobalService } from 'app/services/global.service';
import { ENDPOINT } from 'app/constants/endpoint';
import { QueryListModel } from 'app/models/query-list.model';
import { MeetingRoomFormModel, MeetingRoomListModel, MeetingRoomModel } from 'app/models/meeting-room.model';
import { UserModel } from 'app/models/user.model';

@Injectable({
    providedIn: 'root'
})
export class MeetingRoomService {
    private _listData: BehaviorSubject<DataListModel<MeetingRoomListModel> | null> = new BehaviorSubject(null);
    private _data: BehaviorSubject<MeetingRoomModel | null> = new BehaviorSubject(null);
    private _adminUsers: BehaviorSubject<UserModel[] | null> = new BehaviorSubject(null);
    constructor(private _httpClient: HttpClient, private _globalService: GlobalService) {
    }
    get listData$(): Observable<DataListModel<MeetingRoomListModel>> {
        return this._listData.asObservable();
    }
    get data$(): Observable<MeetingRoomModel> {
        return this._data.asObservable();
    }
    get adminUsers$(): Observable<UserModel[]> {
        return this._adminUsers.asObservable();
    }

    getDatas(query: QueryListModel): Observable<DataListModel<MeetingRoomListModel>> {
        return this._httpClient.post<DataListModel<MeetingRoomListModel>>(ENDPOINT.meetingRoom.search, query).pipe(
            tap((response: any) => {
                this._listData.next(new DataListModel<MeetingRoomListModel>(response, MeetingRoomListModel));
            })
        );
    }
    getData(id: number): Observable<MeetingRoomModel> {
        return this._httpClient.post<MeetingRoomModel>(`${ENDPOINT.meetingRoom.get}/${id}`, null).pipe(
            switchMap((response: any) => of(new MeetingRoomModel(response))),
            tap((response: any) => {
                this._data.next(new MeetingRoomModel(response));
            })
        );
    }
    getAdminUser(): Observable<UserModel[]> {
        return this._httpClient.post<UserModel[]>(ENDPOINT.common.adminUser, null).pipe(
            switchMap((response: any) => of(response.map((c: UserModel) => new UserModel(c)))),
            tap((response: any) => {
                this._adminUsers.next(response.map((c: UserModel) => new UserModel(c)));
            })
        );
    }
    create(postData: MeetingRoomFormModel): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.meetingRoom.add}`, postData);
    }
    update(postData: MeetingRoomFormModel): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.meetingRoom.update}`, postData);
    }
    delete(id: number): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.meetingRoom.delete}/${id}`, id);
    }

}
