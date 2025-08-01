import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENDPOINT } from 'app/constants/endpoint';
import { DataListModel } from 'app/models/data-list.model';
import { InvitationFormModel, InvitationModel } from 'app/models/invitation.model';
import { QueryListModel } from 'app/models/query-list.model';
import { GlobalService } from 'app/services/global.service';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class InvitationService {
    private _listData: BehaviorSubject<DataListModel<InvitationModel> | null> = new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient, private _globalService: GlobalService) {
    }
    get listData$(): Observable<DataListModel<InvitationModel>> {
        return this._listData.asObservable();
    }


    getDatas(query: QueryListModel): Observable<DataListModel<InvitationModel>> {
        return this._httpClient.post<DataListModel<InvitationModel>>(ENDPOINT.invitation.search , query).pipe(
            tap((response: any) => {
                this._listData.next(new DataListModel<InvitationModel>(response, InvitationModel));
            })
        );
    }
    create(postData: InvitationFormModel): Observable<InvitationFormModel> {
        return this._httpClient.post<InvitationFormModel>(`${ENDPOINT.invitation.add}`,postData);
    }
}
