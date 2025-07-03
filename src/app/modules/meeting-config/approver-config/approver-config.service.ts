import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, switchMap, tap } from 'rxjs';
import { DataListModel } from 'app/models/data-list.model';
import { ENDPOINT } from 'app/constants/endpoint';
import { QueryListModel } from 'app/models/query-list.model';
import { ApproverConfigModel } from 'app/models/approver-config.model';
import { AgendaApproverFlowModel, AgendaConfidentialModel, AgendaObjectiveModel, ApproverStepModel, MeetingSubTypeModel, MeetingTypeModel } from 'app/models/standard.model';

@Injectable({
    providedIn: 'root'
})
export class ApproverConfigService {
    private _listData: BehaviorSubject<DataListModel<ApproverConfigModel> | null> = new BehaviorSubject(null);
    private _data: BehaviorSubject<ApproverConfigModel | null> = new BehaviorSubject(null);
    private _meetingTypes: BehaviorSubject<MeetingTypeModel[] | null> = new BehaviorSubject(null);
    private _meetingSubTypes: BehaviorSubject<MeetingSubTypeModel[] | null> = new BehaviorSubject(null);
    private _agendaObjectives: BehaviorSubject<AgendaObjectiveModel[] | null> = new BehaviorSubject(null);
    private _agendaConfidentials: BehaviorSubject<AgendaConfidentialModel[] | null> = new BehaviorSubject(null);
    private _agendaApproverFlows: BehaviorSubject<AgendaApproverFlowModel[] | null> = new BehaviorSubject(null);
    private _approverSteps: BehaviorSubject<ApproverStepModel[] | null> = new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) {
    }
    get listData$(): Observable<DataListModel<ApproverConfigModel>> {
        return this._listData.asObservable();
    }
    get data$(): Observable<ApproverConfigModel> {
        return this._data.asObservable();
    }

    get meetingTypes$(): Observable<MeetingTypeModel[]>{
        return this._meetingTypes.asObservable();
    }
    get meetingSubTypes$(): Observable<MeetingSubTypeModel[]>{
        return this._meetingSubTypes.asObservable();
    }
    get agendaObjectives$(): Observable<AgendaObjectiveModel[]>{
        return this._agendaObjectives.asObservable();
    }
    get agendaConfidentials$(): Observable<AgendaConfidentialModel[]>{
        return this._agendaConfidentials.asObservable();
    }
    get agendaApproverFlows$(): Observable<AgendaApproverFlowModel[]>{
        return this._agendaApproverFlows.asObservable();
    }
    get approverSteps$(): Observable<ApproverStepModel[]>{
        return this._approverSteps.asObservable();
    }

    getDatas(query: QueryListModel): Observable<DataListModel<ApproverConfigModel>> {
        return this._httpClient.post<DataListModel<ApproverConfigModel>>(ENDPOINT.approverConfig.search, query).pipe(
            tap((response: any) => {
                this._listData.next(new DataListModel<ApproverConfigModel>(response, ApproverConfigModel));
            })
        );
    }
    getData(id: number): Observable<ApproverConfigModel> {
        return this._httpClient.post<ApproverConfigModel>(`${ENDPOINT.approverConfig.get}/${id}`, null).pipe(
            switchMap((response: any) => of(new ApproverConfigModel(response))),
            tap((response: ApproverConfigModel) => {
                this._data.next(new ApproverConfigModel(response));
            })
        );
    }

    getMeetingTypes(): Observable<MeetingTypeModel[]>{
         return this._httpClient.post<MeetingTypeModel[]>(`${ENDPOINT.common.meetingType}`, null).pipe(
            tap((response: any) => {
                this._meetingTypes.next(response.map(c=>new MeetingTypeModel(c)));
            })
        );
    }
    getMeetingSubTypes(id: string): Observable<MeetingSubTypeModel[]>{
         return this._httpClient.post<MeetingSubTypeModel[]>(`${ENDPOINT.common.meetingSubType}/${id}`, null).pipe(
            tap((response: any) => {
                this._meetingSubTypes.next(response.map(c=>new MeetingSubTypeModel(c)));
            })
        );
    }
    getAgendaObjectives(): Observable<AgendaObjectiveModel[]>{
         return this._httpClient.post<AgendaObjectiveModel[]>(`${ENDPOINT.common.agendaObjective}`, null).pipe(
            tap((response: any) => {
                this._agendaObjectives.next(response.map(c=>new AgendaObjectiveModel(c)));
            })
        );
    }
    getAgendaConfidentials(): Observable<AgendaConfidentialModel[]>{
         return this._httpClient.post<AgendaConfidentialModel[]>(`${ENDPOINT.common.agendaConfidential}`, null).pipe(
            tap((response: any) => {
                this._agendaConfidentials.next(response.map(c=>new AgendaConfidentialModel(c)));
            })
        );
    }

    getAgendaApproverFlow(): Observable<AgendaApproverFlowModel[]>{
        return this._httpClient.post<AgendaApproverFlowModel[]>(`${ENDPOINT.common.agendaApproverFlow}`, null).pipe(
           tap((response: any) => {
               this._agendaApproverFlows.next(response.map(c=>new AgendaApproverFlowModel(c)));
           })
       );
   }
    getApproverSteps(): Observable<ApproverStepModel[]>{
         return this._httpClient.post<ApproverStepModel[]>(`${ENDPOINT.common.approverStep}`, null).pipe(
            tap((response: any) => {
                this._approverSteps.next(response.map(c=>new ApproverStepModel(c)));
            })
        );
    }

    create(postData: ApproverConfigModel): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.approverConfig.add}`, postData);
    }
    update(postData: ApproverConfigModel): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.approverConfig.update}`, postData);
    }
    delete(id: number): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.approverConfig.delete}/${id}`, id);
    }

}
