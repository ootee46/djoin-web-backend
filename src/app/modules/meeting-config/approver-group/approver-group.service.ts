import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, switchMap, tap } from 'rxjs';
import { DataListModel } from 'app/models/data-list.model';
import { ENDPOINT } from 'app/constants/endpoint';
import { QueryListModel } from 'app/models/query-list.model';
import { ApproverGroupFormModel, ApproverGroupModel } from 'app/models/standard.model';
import { UserModel } from 'app/models/user.model';

@Injectable({
    providedIn: 'root'
})
export class ApproverGroupService {
    private _listData: BehaviorSubject<DataListModel<ApproverGroupModel> | null> = new BehaviorSubject(null);
    private _data: BehaviorSubject<ApproverGroupModel | null> = new BehaviorSubject(null);
    private _allUsers: BehaviorSubject<UserModel[] | null> = new BehaviorSubject(null);
    constructor(private _httpClient: HttpClient) {
    }
    get listData$(): Observable<DataListModel<ApproverGroupModel>> {
        return this._listData.asObservable();
    }
    get data$(): Observable<ApproverGroupModel> {
        return this._data.asObservable();
    }
    get allUsers$(): Observable<UserModel[]> {
        return this._allUsers.asObservable();
    }

    getDatas(query: QueryListModel): Observable<DataListModel<ApproverGroupModel>> {
        return this._httpClient.post<DataListModel<ApproverGroupModel>>(ENDPOINT.approverGroup.search, query).pipe(
            tap((response: any) => {
                this._listData.next(new DataListModel<ApproverGroupModel>(response, ApproverGroupModel));
            })
        );
    }
    getData(id: number): Observable<ApproverGroupModel> {
        return this._httpClient.post<ApproverGroupModel>(`${ENDPOINT.approverGroup.get}/${id}`, null).pipe(
            switchMap((response: any) => of(new ApproverGroupModel(response))),
            tap((response: ApproverGroupModel) => {
                this._data.next(new ApproverGroupModel(response));
            })
        );
    }
    getSystemUser(): Observable<UserModel[]> {
        return this._httpClient.post<UserModel[]>(ENDPOINT.common.systemUser ,null).pipe(
            switchMap((response: any) => of(response.map((c: UserModel) => new UserModel(c)))),
            tap((response: any) => {
                this._allUsers.next(response.map((c: UserModel)=>new UserModel(c)));
            })
        );
    }
    create(postData: ApproverGroupFormModel): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.approverGroup.add}`, postData);
    }
    update(postData: ApproverGroupFormModel): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.approverGroup.update}`, postData);
    }
    delete(id: number): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.approverGroup.delete}/${id}`, id);
    }

}
