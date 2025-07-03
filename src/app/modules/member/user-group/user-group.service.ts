import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of,  switchMap,  tap } from 'rxjs';
import { DataListModel } from 'app/models/data-list.model';
import { GlobalService } from 'app/services/global.service';
import { ENDPOINT } from 'app/constants/endpoint';
import { QueryListModel } from 'app/models/query-list.model';
import { UserGroupFormModel, UserGroupListModel, UserGroupModel } from 'app/models/user-group.model';
import { UserModel } from 'app/models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UserGroupService {
    private _listData: BehaviorSubject<DataListModel<UserGroupListModel> | null> = new BehaviorSubject(null);
    private _data: BehaviorSubject<UserGroupModel | null> = new BehaviorSubject(null);
    private _allUsers: BehaviorSubject<UserModel[] | null> = new BehaviorSubject(null);
    constructor(private _httpClient: HttpClient, private _globalService: GlobalService) {
    }
    get listData$(): Observable<DataListModel<UserGroupListModel>> {
        return this._listData.asObservable();
    }
    get data$(): Observable<UserGroupModel> {
        return this._data.asObservable();
    }
    get allUsers$(): Observable<UserModel[]> {
        return this._allUsers.asObservable();
    }

    getDatas(query: QueryListModel): Observable<DataListModel<UserGroupListModel>> {
        return this._httpClient.post<DataListModel<UserGroupListModel>>(ENDPOINT.userGroup.search , query).pipe(
            tap((response: any) => {
                this._listData.next(new DataListModel<UserGroupListModel>(response,UserGroupListModel));
            })
        );
    }
    getData(id: number): Observable<UserGroupModel> {
        return this._httpClient.post<UserGroupModel>(`${ENDPOINT.userGroup.get}/${id}`,null).pipe(
            switchMap((response: any) => of(new UserGroupModel(response))),
            tap((response: any) => {
                 this._data.next(new UserGroupModel(response));
            })
        );
    }
    getAllUser(): Observable<UserModel[]> {
        return this._httpClient.post<UserModel[]>(ENDPOINT.common.allUser ,null).pipe(
            switchMap((response: any) => of(response.map((c: UserModel) => new UserModel(c)))),
            tap((response: any) => {
                this._allUsers.next(response.map((c: UserModel)=>new UserModel(c)));
            })
        );
    }
    create(postData: UserGroupFormModel): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.userGroup.add}`,postData);
    }
    update(postData: UserGroupFormModel): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.userGroup.update}`,postData);
    }
    delete(id: number): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.userGroup.delete}/${id}`,id);
    }

}
