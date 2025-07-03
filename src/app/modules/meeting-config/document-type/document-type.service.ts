import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, switchMap, tap } from 'rxjs';
import { DataListModel } from 'app/models/data-list.model';
import { ENDPOINT } from 'app/constants/endpoint';
import { QueryListModel } from 'app/models/query-list.model';
import { DocumentTypeFormModel, DocumentTypeListModel, DocumentTypeModel } from 'app/models/document-type.model';

@Injectable({
    providedIn: 'root'
})
export class DocumentTypeService {
    private _listData: BehaviorSubject<DataListModel<DocumentTypeListModel> | null> = new BehaviorSubject(null);
    private _data: BehaviorSubject<DocumentTypeModel | null> = new BehaviorSubject(null);
    constructor(private _httpClient: HttpClient) {
    }
    get listData$(): Observable<DataListModel<DocumentTypeListModel>> {
        return this._listData.asObservable();
    }
    get data$(): Observable<DocumentTypeModel> {
        return this._data.asObservable();
    }

    getDatas(query: QueryListModel): Observable<DataListModel<DocumentTypeListModel>> {
        return this._httpClient.post<DataListModel<DocumentTypeListModel>>(ENDPOINT.documentType.search, query).pipe(
            tap((response: any) => {
                this._listData.next(new DataListModel<DocumentTypeListModel>(response, DocumentTypeListModel));
            })
        );
    }
    getData(id: number): Observable<DocumentTypeModel> {
        return this._httpClient.post<DocumentTypeModel>(`${ENDPOINT.documentType.get}/${id}`, null).pipe(
            switchMap((response: any) => of(new DocumentTypeModel(response))),
            tap((response: DocumentTypeModel) => {
                this._data.next(new DocumentTypeModel(response));
            })
        );
    }
    create(postData: DocumentTypeFormModel): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.documentType.add}`, postData);
    }
    update(postData: DocumentTypeFormModel): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.documentType.update}`, postData);
    }
    delete(id: number): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.documentType.delete}/${id}`, id);
    }

}
