import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENDPOINT } from 'app/constants/endpoint';
import { AgendaRequestAttachmentFormModel, AgendaRequestAttachmentPermissionFormModel } from 'app/models/agenda-request.model';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class UploadDocumentService {
    constructor(private _httpClient: HttpClient) {
    }

    add(postData: AgendaRequestAttachmentFormModel): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.agendaRequest.addAttachment}`,postData);
    }

    delete(id: number ): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.agendaRequest.removeAttachment}/${id}`,null);
    }

    pos(postData: AgendaRequestAttachmentFormModel ): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.agendaRequest.posAttachment}`,postData);
    }

    updatePermission(postData: AgendaRequestAttachmentPermissionFormModel ): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.agendaRequest.updateAttachmentPermission}`,postData);
    }

    updatePermissionForList(postData: AgendaRequestAttachmentPermissionFormModel[] ): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.agendaRequest.updateAttachmentPermissionForList}`,postData);
    }
}
