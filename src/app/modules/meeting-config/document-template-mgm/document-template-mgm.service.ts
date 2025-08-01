import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, switchMap, tap } from 'rxjs';
import { DataListModel } from 'app/models/data-list.model';
import { ENDPOINT } from 'app/constants/endpoint';
import { QueryListModel } from 'app/models/query-list.model';
import { DocumentTemplateFormModel, DocumentTemplateListModel, DocumentTemplateModel } from 'app/models/document-template.model';

@Injectable({
    providedIn: 'root'
})
export class DocumentTemplateMgmService {
    private _listData: BehaviorSubject<DataListModel<DocumentTemplateListModel> | null> = new BehaviorSubject(null);
    private _data: BehaviorSubject<DocumentTemplateModel | null> = new BehaviorSubject(null);
    constructor(private _httpClient: HttpClient) {
    }
    get listData$(): Observable<DataListModel<DocumentTemplateListModel>> {
        return this._listData.asObservable();
    }
    get data$(): Observable<DocumentTemplateModel> {
        return this._data.asObservable();
    }

    getDatas(query: QueryListModel): Observable<DataListModel<DocumentTemplateListModel>> {
        return this._httpClient.post<DataListModel<DocumentTemplateListModel>>(ENDPOINT.documentTemplate.search, query).pipe(
            tap((response: any) => {
                this._listData.next(new DataListModel<DocumentTemplateListModel>(response, DocumentTemplateListModel));
            })
        );
    }
    getData(id: number): Observable<DocumentTemplateModel> {
        return this._httpClient.post<DocumentTemplateModel>(`${ENDPOINT.documentTemplate.get}/${id}`, null).pipe(
            switchMap((response: any) => of(new DocumentTemplateModel(response))),
            tap((response: DocumentTemplateModel) => {
                this._data.next(new DocumentTemplateModel(response));
            })
        );
    }
    create(postData: DocumentTemplateFormModel): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.documentTemplate.add}`, postData);
    }
    update(postData: DocumentTemplateFormModel): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.documentTemplate.update}`, postData);
    }
    delete(id: number): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.documentTemplate.delete}/${id}`, id);
    }

}
