import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENDPOINT } from 'app/constants/endpoint';
import { AgendaRequestItemListModel, AgendaRequestItemModel } from 'app/models/agenda-request.model';
import { AgendaReserveItemModel } from 'app/models/agenda-reserve.model';
import { MeetingAttendeeModel } from 'app/models/attendee.model';
import { DataListModel } from 'app/models/data-list.model';
import { MeetingFormModel, MeetingListModel, MeetingModel } from 'app/models/meeting.model';
import { MinuteConfirmFormModel, MinuteConfirmModel, MinuteFormModel, MinuteHistoryModel } from 'app/models/minute.model';
import { QueryListModel } from 'app/models/query-list.model';
import { StandardModel } from 'app/models/standard.model';
import { SuccessModel } from 'app/models/success.model';
import { UserModel } from 'app/models/user.model';
import { GlobalService } from 'app/services/global.service';
import { BehaviorSubject, Observable, of, switchMap, take, tap } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class MeetingMgmService {
    private _listData: BehaviorSubject<DataListModel<MeetingListModel> | null> = new BehaviorSubject(null);
    private _data: BehaviorSubject<MeetingModel | null> = new BehaviorSubject(null);
    private _users: BehaviorSubject<UserModel[] | null> = new BehaviorSubject(null);
    private _meetingGroups: BehaviorSubject<StandardModel[] | null> = new BehaviorSubject(null);
    private _meetingTypes: BehaviorSubject<StandardModel[] | null> = new BehaviorSubject(null);
    private _meetingSubTypes: BehaviorSubject<StandardModel[] | null> = new BehaviorSubject(null);
    private _agendaApproveFlows: BehaviorSubject<StandardModel[] | null> = new BehaviorSubject(null);
    private _documentTypes: BehaviorSubject<StandardModel[] | null> = new BehaviorSubject(null);
    private _attendees: BehaviorSubject<MeetingAttendeeModel[] | null> = new BehaviorSubject(null);
    private _attendeeUsers: BehaviorSubject<UserModel[] | null> = new BehaviorSubject(null);
    private _venues: BehaviorSubject<StandardModel[] | null> = new BehaviorSubject(null);
    private _agendaRequests: BehaviorSubject<AgendaRequestItemListModel[] | null> = new BehaviorSubject([]);
    private _agendaRequestDetail: BehaviorSubject<AgendaRequestItemModel | null> = new BehaviorSubject(new AgendaRequestItemModel({}));
    private _userGroups: BehaviorSubject<StandardModel[] | null> = new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient, private _globalService: GlobalService) {
    }
    get listData$(): Observable<DataListModel<MeetingListModel>> {
        return this._listData.asObservable();
    }
    get data$(): Observable<MeetingModel> {
        return this._data.asObservable();
    }
    get users$(): Observable<UserModel[]> {
        return this._users.asObservable();
    }
    get meetingGroups$(): Observable<StandardModel[]>{
        return this._meetingGroups.asObservable();
    }
    get meetingTypes$(): Observable<StandardModel[]>{
        return this._meetingTypes.asObservable();
    }
    get meetingSubTypes$(): Observable<StandardModel[]>{
        return this._meetingSubTypes.asObservable();
    }
    get agendaApproveFlows$(): Observable<StandardModel[]>{
        return this._agendaApproveFlows.asObservable();
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
    get venues$(): Observable<StandardModel[]> {
        return this._venues.asObservable();
    }
    get agendaRequests$(): Observable<AgendaRequestItemListModel[]> {
        return this._agendaRequests.asObservable();
    }
    get agendaRequestDetail$(): Observable<AgendaRequestItemModel> {
        return this._agendaRequestDetail.asObservable();
    }
    get userGroups$(): Observable<StandardModel[]> {
        return this._userGroups.asObservable();
    }

    getDatas(query: QueryListModel): Observable<DataListModel<MeetingListModel>> {
        return this._httpClient.post<DataListModel<MeetingListModel>>(ENDPOINT.meeting.search , query).pipe(
            tap((response: any) => {
                this._listData.next(new DataListModel<MeetingListModel>(response,MeetingModel));
            })
        );
    }
    getData(id: string): Observable<MeetingModel> {
        return this._httpClient.post<MeetingModel>(`${ENDPOINT.meeting.get}/${id}`,null).pipe(
            tap((response: any) => {
                 this._data.next(new MeetingModel(response));
                 if(response && response.meetingTypeId && typeof(response.meetingTypeId) == 'number'){
                    this.getMeetingSubType(response.meetingTypeId.toString()).pipe(take(1)).subscribe();
                 }
            })
        );
    }

    getAttendee(id: string): Observable<MeetingAttendeeModel[]> {
        return this._httpClient.post<MeetingAttendeeModel[]>(ENDPOINT.meetingAttendee.search.concat('/').concat(id),null).pipe(
            tap((response: any) => {
                this._attendees.next(response.map(c=>new MeetingAttendeeModel(c)));
                if(this._attendees.getValue()){
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
                else{
                    this._attendeeUsers.next([]);
                }
            })
        );
    }

    getUserGroup(id: string): Observable<StandardModel[]> {
        return this._httpClient.post<StandardModel[]>(`${ENDPOINT.meetingAttendee.getuserGroup}/${id}`,null).pipe(
            tap((response: any) => {
                this._userGroups.next(response.map((c: StandardModel)=>new StandardModel(c)));
            })
        );
    }

    getVenue(): Observable<StandardModel[]> {
        return this._httpClient.post<StandardModel[]>(ENDPOINT.venue.getAll,null).pipe(
            tap((response: any) => {
                this._venues.next(response.map(c=>new StandardModel(c)));
            })
        );
    }

    getAllUser(): Observable<UserModel[]> {
        return this._httpClient.post<UserModel[]>(ENDPOINT.common.allUser ,null).pipe(
            tap((response: any) => {
                this._users.next(response.map((c: UserModel)=>new UserModel(c)));
            })
        );
    }

    getMeetingGroup(): Observable<StandardModel[]> {
        return this._httpClient.post<StandardModel[]>(ENDPOINT.common.allMeetingGroup ,null).pipe(
            tap((response: any) => {
                this._meetingGroups.next(response.map((c: StandardModel)=>new StandardModel(c)));
            })
        );
    }

    getAllMeetingGroup(): Observable<StandardModel[]> {
        return this._httpClient.post<StandardModel[]>(ENDPOINT.common.allMeetingGroup ,null).pipe(
            tap((response: any) => {
                this._meetingGroups.next(response.map((c: StandardModel)=>new StandardModel(c)));
            })
        );
    }

    getMeetingType(): Observable<StandardModel[]> {
        return this._httpClient.post<StandardModel[]>(ENDPOINT.common.meetingType ,null).pipe(
            tap((response: any) => {
                this._meetingTypes.next(response.map((c: StandardModel)=>new StandardModel(c)));
            })
        );
    }

    getMeetingSubType(id: string): Observable<StandardModel[]> {
        return this._httpClient.post<StandardModel[]>(ENDPOINT.common.meetingSubType.concat('/').concat(id) ,null).pipe(
            tap((response: any) => {
                this._meetingSubTypes.next(response.map((c: StandardModel)=>new StandardModel(c)));
            })
        );
    }

    getAgendaApproveFlow(): Observable<StandardModel[]> {
        return this._httpClient.post<StandardModel[]>(ENDPOINT.common.agendaApproverFlow ,null).pipe(
            tap((response: any) => {
                this._agendaApproveFlows.next(response.map((c: StandardModel)=>new StandardModel(c)));
            })
        );
    }

    getDocumentType(): Observable<StandardModel[]> {
        return this._httpClient.post<StandardModel[]>(ENDPOINT.common.documentType ,null).pipe(
            tap((response: any) => {
                this._documentTypes.next(response.map((c: StandardModel)=>new StandardModel(c)));
            })
        );
    }
    create(postData: MeetingFormModel): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.meeting.add}`,postData);
    }
    update(postData: MeetingFormModel): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.meeting.update}`,postData);
    }

    delete(id: number): Observable<SuccessModel[]> {
        return this._httpClient.post<SuccessModel[]>(`${ENDPOINT.meeting.delete}/${id}`,id);
    }
    duplicate(id: number): Observable<SuccessModel[]> {
        return this._httpClient.post<SuccessModel[]>(`${ENDPOINT.meeting.duplicate}/${id}`,id);
    }

    getAgendaRequest(id: string): Observable<AgendaRequestItemListModel[]> {
        return this._httpClient.post<AgendaRequestItemListModel[]>(`${ENDPOINT.agendaRequest.getByMeeting}/${id}` ,null).pipe(
            tap((response: any) => {
                this._agendaRequests.next(response.map((c: AgendaRequestItemListModel)=>new AgendaRequestItemListModel(c)));
            })
        );
    }

    getAgendaRequestDetail(id: number):  Observable<AgendaRequestItemModel> {
        return this._httpClient.post<AgendaRequestItemModel>(`${ENDPOINT.meetingAgenda.agendaReserveDetailGet}/${id}`, null).pipe(
            switchMap((response: any) => of(new AgendaRequestItemModel(response))),
            tap((response: AgendaRequestItemModel) => {
                this._agendaRequestDetail.next(new AgendaRequestItemModel(response));
            })
        );
    }

}
