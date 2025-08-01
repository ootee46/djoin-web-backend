import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, switchMap, tap } from 'rxjs';
import { DataListModel } from 'app/models/data-list.model';
import { ENDPOINT } from 'app/constants/endpoint';
import { QueryListModel } from 'app/models/query-list.model';
import {  DocumentTemplateListModel } from 'app/models/document-template.model';

@Injectable({
    providedIn: 'root'
})
export class DocumentTemplateService {
    private _listData: BehaviorSubject<DataListModel<DocumentTemplateListModel> | null> = new BehaviorSubject(null);
    constructor(private _httpClient: HttpClient) {
    }
    get listData$(): Observable<DataListModel<DocumentTemplateListModel>> {
        return this._listData.asObservable();
    }
    getDatas(query: QueryListModel): Observable<DataListModel<DocumentTemplateListModel>> {
        query.statusId = 1;
        return this._httpClient.post<DataListModel<DocumentTemplateListModel>>(ENDPOINT.documentTemplate.search, query).pipe(
            tap((response: any) => {
                this._listData.next(new DataListModel<DocumentTemplateListModel>(response, DocumentTemplateListModel));
            })
        );
    }

}
