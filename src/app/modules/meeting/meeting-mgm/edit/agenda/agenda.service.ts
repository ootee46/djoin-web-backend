import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENDPOINT } from 'app/constants/endpoint';
import { AgendaRefAttachmentModel } from 'app/models/agenda-ref-attachment.model';
import { AgendaRequestImportModel } from 'app/models/agenda-request-import.model';
import { AgendaRequestItemListModel, AgendaRequestItemModel } from 'app/models/agenda-request.model';
import { AgendumExportModel } from 'app/models/agendum-export.mode';
import { MeetingAgendaAttachmentFormModel, MeetingAgendaAttachmentPermissionFormModel, MeetingAgendaFormModel, MeetingAgendaModel } from 'app/models/meeting-agenda.model';
import { MeetingMgmModel } from 'app/models/meeting-mgm.model';
import { MemberUserModel } from 'app/models/member-user.model';
import { QueryListModel } from 'app/models/query-list.model';
import { ReplaceAttachmentFormModel } from 'app/models/replace-attachment.model';
import { StandardModel } from 'app/models/standard.model';
import { SuccessModel } from 'app/models/success.model';
import { UserModel } from 'app/models/user.model';
import { GlobalService } from 'app/services/global.service';
import { map } from 'lodash';
import { BehaviorSubject, Observable, of, switchMap, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AgendaService {
    private _listData: BehaviorSubject<MeetingAgendaModel[] | null> = new BehaviorSubject(null);
    private _data: BehaviorSubject<MeetingAgendaModel | null> = new BehaviorSubject(null);
    private _adminUsers: BehaviorSubject<MemberUserModel[] | null> = new BehaviorSubject(null);
    private _meetings: BehaviorSubject<MeetingMgmModel[] | null> = new BehaviorSubject(null);
    private _agendas: BehaviorSubject<MeetingAgendaModel[] | null> = new BehaviorSubject(null);
    private _agendaRefAttachment: BehaviorSubject<AgendaRefAttachmentModel | null> = new BehaviorSubject(null);
    private _agendaReserve: BehaviorSubject<AgendaRequestItemListModel[] | null> = new BehaviorSubject(null);
    private _agendaReserveDetail: BehaviorSubject<AgendaRequestItemModel | null> = new BehaviorSubject(null);
    private _users: BehaviorSubject<UserModel[] | null> = new BehaviorSubject(null);
    private _userGroups: BehaviorSubject<StandardModel[] | null> = new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient, private _globalService: GlobalService) {
    }
    get listData$(): Observable<MeetingAgendaModel[]> {
        return this._listData.asObservable();
    }
    get agendas$(): Observable<MeetingAgendaModel[]> {
        return this._agendas.asObservable();
    }
    get data$(): Observable<MeetingAgendaModel> {
        return this._data.asObservable();
    }
    get adminUsers$(): Observable<MemberUserModel[]> {
        return this._adminUsers.asObservable();
    }
    get meetings$(): Observable<MeetingMgmModel[]> {
        return this._meetings.asObservable();
    }
    get agendaRefAttachment$(): Observable<AgendaRefAttachmentModel> {
        return this._agendaRefAttachment.asObservable();
    }
    get agendaReserve$(): Observable<AgendaRequestItemListModel[]> {
        return this._agendaReserve.asObservable();
    }
    get agendaReserveDetail$(): Observable<AgendaRequestItemModel> {
        return this._agendaReserveDetail.asObservable();
    }
    get users$(): Observable<UserModel[]> {
        return this._users.asObservable();
    }
    get userGroups$(): Observable<StandardModel[]> {
        return this._userGroups.asObservable();
    }

    clearList(): Observable<any>{
        this._agendas.next([]);
        this._listData.next([]);
        return of(null);
    }
    getDatas(query: QueryListModel): Observable<MeetingAgendaModel[]> {
        return this._httpClient.post<MeetingAgendaModel[]>(ENDPOINT.meetingAgenda.search , query).pipe(
            tap((response: any) => {
                this._listData.next(response.map(c=>new MeetingAgendaModel(c)));
            })
        );
    }
    getAgendas(query: QueryListModel): Observable<MeetingAgendaModel[]> {
        return this._httpClient.post<MeetingAgendaModel[]>(ENDPOINT.meetingAgenda.search , query).pipe(
            tap((response: any) => {
                this._agendas.next(response.map(c=>new MeetingAgendaModel(c)));
            })
        );
    }
    getMeeting(): Observable<MeetingMgmModel[]> {
        return this._httpClient.post<MeetingMgmModel[]>(ENDPOINT.meetingMgm.getAll ,null).pipe(
            tap((response: any) => {
                this._meetings.next(response.map((c: MeetingMgmModel)=>new MeetingMgmModel(c)));
            })
        );
    }
    getData(id: number): Observable<MeetingAgendaModel> {
        return this._httpClient.post<MeetingAgendaModel>(`${ENDPOINT.meetingAgenda.get}/${id}`,null).pipe(
            tap((response: any) => {
                 this._data.next(new MeetingAgendaModel(response));
            }),
            switchMap(() => of(this._data.getValue())),
        );
    }
    getAgendaRefAttachment(id: number): Observable<AgendaRefAttachmentModel> {
        return this._httpClient.post<AgendaRefAttachmentModel>(`${ENDPOINT.meetingAgenda.refAttachmentGet}/${id}`,null).pipe(
            tap((response: any) => {
                 this._agendaRefAttachment.next(new AgendaRefAttachmentModel(response));
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

    getAgendaReserve(id: number): Observable<AgendaRequestItemListModel[]> {
        return this._httpClient.post<AgendaRequestItemListModel[]>(`${ENDPOINT.meetingAgenda.agendaReserveGet}/${id}` ,null).pipe(
            tap((response: any) => {
                this._agendaReserve.next(response.map((c: AgendaRequestItemListModel)=>new AgendaRequestItemListModel(c)));
            })
        );
    }

    getAgendaReserveWating(id: number): Observable<AgendaRequestItemListModel[]> {
        return this._httpClient.post<AgendaRequestItemListModel[]>(`${ENDPOINT.meetingAgenda.agendaReserveWatingGet}/${id}` ,null).pipe(
            tap((response: any) => {
                this._agendaReserve.next(response.map((c: AgendaRequestItemListModel)=>new AgendaRequestItemListModel(c)));
            })
        );
    }

    getAgendaReserveDetail(id: number): Observable<AgendaRequestItemModel> {
        return this._httpClient.post<AgendaRequestItemModel>(`${ENDPOINT.meetingAgenda.agendaReserveDetailGet}/${id}` ,null).pipe(
            tap((response: any) => {
                if(response){
                    this._agendaReserveDetail.next(new AgendaRequestItemModel(response));
                }else{
                    this._agendaReserveDetail.next(null);
                }
            })
        );
    }

    getUserGroup(): Observable<StandardModel[]> {
        return this._httpClient.post<StandardModel[]>(ENDPOINT.common.userGroup,null).pipe(
            tap((response: any) => {
                this._userGroups.next(response.map((c: StandardModel)=>new StandardModel(c)));
            })
        );
    }
    getUser(id: string): Observable<UserModel[]> {
        if(id){
            return this._httpClient.post<UserModel[]>(ENDPOINT.user.getAll.concat('/').concat(id) ,null).pipe(
                tap((response: any) => {
                    const datas = response.map((c: UserModel)=>new UserModel(c));
                    this._users.next(datas);
                })
            );
        }else{
            return this._httpClient.post<UserModel[]>(ENDPOINT.user.getAll ,null).pipe(
                tap((response: any) => {
                    const datas = response.map((c: UserModel)=>new UserModel(c));
                    this._users.next(datas);
                })
            );
        }

    }

    agendumExport(id:number): Observable<AgendumExportModel> {
        return this._httpClient.post<AgendumExportModel>(`${ENDPOINT.meeting.agundumExport}/${id}`,null).pipe(
            switchMap((response: any) => {
                if(!response){
                    return of(null);
                }
                else{
                    return of(new AgendumExportModel(response));
                }
            })
        );
    }

    create(postData: MeetingAgendaFormModel): Observable<MeetingAgendaFormModel> {
        return this._httpClient.post<MeetingAgendaFormModel>(`${ENDPOINT.meetingAgenda.add}`,postData);
    }
    update(postData: MeetingAgendaFormModel): Observable<MeetingAgendaFormModel> {
        return this._httpClient.post<MeetingAgendaFormModel>(`${ENDPOINT.meetingAgenda.update}`,postData);
    }

    delete(id: number): Observable<SuccessModel[]> {
        return this._httpClient.post<SuccessModel[]>(`${ENDPOINT.meetingAgenda.delete}/${id}`,id);
    }
    moveDown(id: number): Observable<SuccessModel[]> {
        return this._httpClient.post<SuccessModel[]>(`${ENDPOINT.meetingAgenda.moveDown}/${id}`,id);
    }
    moveUp(id: number): Observable<SuccessModel[]> {
        return this._httpClient.post<SuccessModel[]>(`${ENDPOINT.meetingAgenda.moveUp}/${id}`,id);
    }
    move(id: number, replaceId: number): Observable<SuccessModel[]> {
        return this._httpClient.post<SuccessModel[]>(`${ENDPOINT.meetingAgenda.move}/${id}/${replaceId}`,id);
    }

    replaceFile(postData: ReplaceAttachmentFormModel): Observable<SuccessModel[]> {
        return this._httpClient.post<SuccessModel[]>(`${ENDPOINT.meetingAgenda.attachmentReplace}`,postData);
    }

    importReserve(postData: AgendaRequestImportModel): Observable<SuccessModel[]> {
        return this._httpClient.post<SuccessModel[]>(`${ENDPOINT.meetingAgenda.reserveImport}`,postData);
    }

    attachmentAdd(postData: MeetingAgendaAttachmentFormModel): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.meetingAgenda.attachmentAdd}`,postData);
    }

    attachmentDelete(id: number ): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.meetingAgenda.attachmentDelete}/${id}`,null);
    }

    attachmentPos(postData: MeetingAgendaAttachmentFormModel ): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.meetingAgenda.attachmentPos}`,postData);
    }

    attachmentPosBatch(postData: MeetingAgendaAttachmentFormModel[] ): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.meetingAgenda.attachmentPosBatch}`,postData);
    }

    attachmentPermission(postData: MeetingAgendaAttachmentPermissionFormModel ): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.meetingAgenda.attachmentPermission}`,postData);
    }

    attachmentPermissionForList(postData: MeetingAgendaAttachmentPermissionFormModel[] ): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.meetingAgenda.attachmentPermissionForList}`,postData);
    }

    presenterAttachmentAdd(postData: MeetingAgendaAttachmentFormModel): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.meetingAgenda.presenterAttachmentAdd}`,postData);
    }

    presenterAttachmentDelete(id: number ): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.meetingAgenda.presenterAttachmentDelete}/${id}`,null);
    }

    clearAgenda(): void{
        this._agendas.next([]);
    }

}
