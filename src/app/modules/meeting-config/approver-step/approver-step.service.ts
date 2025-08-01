import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, switchMap, tap } from 'rxjs';
import { DataListModel } from 'app/models/data-list.model';
import { ENDPOINT } from 'app/constants/endpoint';
import { QueryListModel } from 'app/models/query-list.model';
import { ApproverGroupModel, ApproverPositionModel, ApproverStepModel } from 'app/models/standard.model';
import { UserModel } from 'app/models/user.model';

@Injectable({
    providedIn: 'root'
})
export class ApproverStepService {
    private _listData: BehaviorSubject<DataListModel<ApproverStepModel> | null> = new BehaviorSubject(null);
    private _data: BehaviorSubject<ApproverStepModel | null> = new BehaviorSubject(null);
    private _users: BehaviorSubject<UserModel[] | null> = new BehaviorSubject(null);
    private _approverPositions: BehaviorSubject<ApproverPositionModel[] | null> = new BehaviorSubject(null);
    private _approverGroups: BehaviorSubject<ApproverGroupModel[] | null> = new BehaviorSubject(null);
    constructor(private _httpClient: HttpClient) {
    }
    get listData$(): Observable<DataListModel<ApproverStepModel>> {
        return this._listData.asObservable();
    }
    get data$(): Observable<ApproverStepModel> {
        return this._data.asObservable();
    }
    get users$(): Observable<UserModel[]> {
        return this._users.asObservable();
    }
    get approverPositions$(): Observable<ApproverPositionModel[]> {
        return this._approverPositions.asObservable();
    }
    get approverGroups$(): Observable<ApproverGroupModel[]> {
        return this._approverGroups.asObservable();
    }


    getDatas(query: QueryListModel): Observable<DataListModel<ApproverStepModel>> {
        return this._httpClient.post<DataListModel<ApproverStepModel>>(ENDPOINT.approverStep.search, query).pipe(
            tap((response: any) => {
                this._listData.next(new DataListModel<ApproverStepModel>(response, ApproverStepModel));
            })
        );
    }
    getData(id: number): Observable<ApproverStepModel> {
        return this._httpClient.post<ApproverStepModel>(`${ENDPOINT.approverStep.get}/${id}`, null).pipe(
            switchMap((response: any) => of(new ApproverStepModel(response))),
            tap((response: ApproverStepModel) => {
                this._data.next(new ApproverStepModel(response));
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
    getApproverPosition(): Observable<ApproverPositionModel[]> {
        return this._httpClient.post<ApproverPositionModel[]>(ENDPOINT.common.approverPosition , null).pipe(
            tap((response: any) => {
                this._approverPositions.next(response.map(c=>new ApproverPositionModel(c)));
            })
        );
    }
    getApproverGroup(): Observable<ApproverGroupModel[]> {
        return this._httpClient.post<ApproverGroupModel[]>(ENDPOINT.common.approverGroup , null).pipe(
            tap((response: any) => {
                this._approverGroups.next(response.map(c=>new ApproverGroupModel(c)));
            })
        );
    }
    create(postData: ApproverStepModel): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.approverStep.add}`, postData);
    }
    update(postData: ApproverStepModel): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.approverStep.update}`, postData);
    }
    delete(id: number): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.approverStep.delete}/${id}`, id);
    }

}
