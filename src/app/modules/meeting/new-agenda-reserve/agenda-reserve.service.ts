import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENDPOINT } from 'app/constants/endpoint';
import {
    AgendaRequestAttachmentPermissionFormModel,
    AgendaRequestItemModel,
    AgendaRequestModel,
} from 'app/models/agenda-request.model';
import { MeetingAttendeeModel } from 'app/models/attendee.model';
import { DataListModel } from 'app/models/data-list.model';
import { MeetingListModel } from 'app/models/meeting.model';
import { QueryListModel } from 'app/models/query-list.model';
import { StandardModel } from 'app/models/standard.model';
import { SuccessModel } from 'app/models/success.model';
import { UserModel } from 'app/models/user.model';
import { GlobalService } from 'app/services/global.service';
import { BehaviorSubject, Observable, of, switchMap, take, tap } from 'rxjs';

import { AgendaRequestFormModel, AgendaRequestUpdateFormModel } from './../../../models/agenda-request-form.model';
import { BookingExportModel } from 'app/models/booking-export.model';

@Injectable({
    providedIn: 'root'
})
export class AgendaReserveService {
    private _listData: BehaviorSubject<DataListModel<AgendaRequestItemModel> | null> = new BehaviorSubject(null);
    private _data: BehaviorSubject<AgendaRequestItemModel | null> = new BehaviorSubject(null);
    private _users: BehaviorSubject<UserModel[] | null> = new BehaviorSubject(null);
    private _meetings: BehaviorSubject<MeetingListModel[] | null> = new BehaviorSubject(null);
    private _confidentials: BehaviorSubject<StandardModel[] | null> = new BehaviorSubject(null);
    private _objectives: BehaviorSubject<StandardModel[] | null> = new BehaviorSubject(null);
    private _documentTypes: BehaviorSubject<StandardModel[] | null> = new BehaviorSubject(null);
    private _attendees: BehaviorSubject<MeetingAttendeeModel[] | null> = new BehaviorSubject(null);
    private _attendeeUsers: BehaviorSubject<UserModel[] | null> = new BehaviorSubject(null);
    private _userGroups: BehaviorSubject<StandardModel[] | null> = new BehaviorSubject(null);
    constructor(private _httpClient: HttpClient, private _globalService: GlobalService) {
    }
    get listData$(): Observable<DataListModel<AgendaRequestItemModel>> {
        return this._listData.asObservable();
    }
    get data$(): Observable<AgendaRequestItemModel> {
        return this._data.asObservable();
    }
    get users$(): Observable<UserModel[]> {
        return this._users.asObservable();
    }
    get meetings$(): Observable<MeetingListModel[]> {
        return this._meetings.asObservable();
    }
    get confidentials$(): Observable<StandardModel[]> {
        return this._confidentials.asObservable();
    }
    get objectives$(): Observable<StandardModel[]> {
        return this._objectives.asObservable();
    }
    get documentTypes$(): Observable<StandardModel[]> {
        return this._documentTypes.asObservable();
    }
    get attendees$(): Observable<MeetingAttendeeModel[]> {
        return this._attendees.asObservable();
    }
    get attendeeUsers$(): Observable<UserModel[]> {
        return this._attendeeUsers.asObservable();
    }
    get userGroups$(): Observable<StandardModel[]> {
        return this._userGroups.asObservable();
    }

    getDatas(query: QueryListModel): Observable<DataListModel<AgendaRequestItemModel>> {
        return this._httpClient.post<DataListModel<AgendaRequestItemModel>>(ENDPOINT.agendaRequestItem.search, query).pipe(
            tap((response: any) => {
                this._listData.next(new DataListModel<AgendaRequestItemModel>(response, AgendaRequestItemModel));
            })
        );
    }

    getData(id: string): Observable<AgendaRequestItemModel> {
        return this._httpClient.post<AgendaRequestItemModel>(`${ENDPOINT.agendaRequest.get}/${id}`, null).pipe(
            tap((response: AgendaRequestItemModel) => {
                if (response && response.meetingId) {
                    this.getAttendee(response.meetingId).pipe(take(1)).subscribe();
                    this.getUserGroup(response.meetingId).pipe(take(1)).subscribe();
                }
                this._data.next(new AgendaRequestItemModel(response));
            })
        );
    }

    getAllUser(): Observable<UserModel[]> {
        return this._httpClient.post<UserModel[]>(ENDPOINT.common.systemUser, null).pipe(
            tap((response: any) => {
                this._users.next(response.map((c: UserModel) => new UserModel(c)));
            })
        );
    }

    getConfidential(): Observable<StandardModel[]> {
        return this._httpClient.post<StandardModel[]>(ENDPOINT.common.agendaConfidential, null).pipe(
            tap((response: any) => {
                this._confidentials.next(response.map((c: StandardModel) => new StandardModel(c)));
            })
        );
    }

    getObjective(): Observable<StandardModel[]> {
        return this._httpClient.post<StandardModel[]>(ENDPOINT.common.agendaObjective, null).pipe(
            tap((response: any) => {
                this._objectives.next(response.map((c: StandardModel) => new StandardModel(c)));
            })
        );
    }

    getDocumentType(): Observable<StandardModel[]> {
        return this._httpClient.post<StandardModel[]>(ENDPOINT.common.documentType, null).pipe(
            tap((response: any) => {
                this._documentTypes.next(response.map((c: StandardModel) => new StandardModel(c)));
            })
        );
    }

    getMeeting(): Observable<MeetingListModel[]> {
        return this._httpClient.post<MeetingListModel[]>(ENDPOINT.agendaRequest.getAvailableMeeting, null).pipe(
            tap((response: any) => {
                this._meetings.next(response.map((c: MeetingListModel) => new MeetingListModel(c)));
            })
        );
    }

    getAttendee(id: number): Observable<MeetingAttendeeModel[]> {
        return this._httpClient.post<MeetingAttendeeModel[]>(ENDPOINT.meetingAttendee.search.concat('/').concat(id.toString()), null).pipe(
            tap((response: any) => {
                this._attendees.next(response.map(c => new MeetingAttendeeModel(c)));
                if (this._attendees.getValue()) {
                    const attendeeUsers: UserModel[] = [];
                    this._attendees.getValue().forEach((element) => {
                        const obj: UserModel = new UserModel({});
                        obj.id = element.userId;
                        obj.userName = element.userName;
                        obj.name = element.name;
                        obj.userGroups = element.userGroups;
                        attendeeUsers.push(obj);
                    });
                    this._attendeeUsers.next(attendeeUsers);
                }
                else {
                    this._attendeeUsers.next([]);
                }
            })
        );
    }

    getUserGroup(id: number): Observable<StandardModel[]> {
        return this._httpClient.post<StandardModel[]>(`${ENDPOINT.meetingAttendee.getuserGroup}/${id}`, null).pipe(
            tap((response: any) => {
                this._userGroups.next(response.map((c: StandardModel) => new StandardModel(c)));
            })
        );
    }

    getUser(id: string): Observable<UserModel[]> {
        if (id) {
            return this._httpClient.post<UserModel[]>(ENDPOINT.user.getAll.concat('/').concat(id), null).pipe(
                tap((response: any) => {
                    const datas = response.map((c: UserModel) => new UserModel(c));
                    this._attendeeUsers.next(datas);
                })
            );
        } else {
            return this._httpClient.post<UserModel[]>(ENDPOINT.user.getAll, null).pipe(
                tap((response: any) => {
                    const datas = response.map((c: UserModel) => new UserModel(c));
                    this._attendeeUsers.next(datas);
                })
            );
        }

    }


    create(postData: AgendaRequestFormModel[]): Observable<AgendaRequestModel> {
        return this._httpClient.post<AgendaRequestModel>(`${ENDPOINT.agendaRequest.add}`, postData);
    }

    update(postData: AgendaRequestUpdateFormModel): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.agendaRequest.update}`, postData);
    }

    submit(postData: AgendaRequestUpdateFormModel): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.agendaRequest.submit}`, postData);
    }

    reSubmit(postData: AgendaRequestUpdateFormModel): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.agendaRequest.reSubmit}`, postData);
    }

    delete(id: number): Observable<SuccessModel[]> {
        return this._httpClient.post<SuccessModel[]>(`${ENDPOINT.agendaRequest.delete}/${id}`, id);
    }
    updatePermission(postData: AgendaRequestAttachmentPermissionFormModel): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.agendaRequest.updateAttachmentPermission}`, postData);
    }

}
