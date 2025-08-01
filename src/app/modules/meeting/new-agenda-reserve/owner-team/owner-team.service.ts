import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENDPOINT } from 'app/constants/endpoint';
import { AgendaRequestTeamFormModel } from 'app/models/agenda-request.model';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class OwnerTeamService {
    constructor(private _httpClient: HttpClient) {
    }

    delete(postData: AgendaRequestTeamFormModel): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.agendaRequest.removeTeam}`,postData);
    }

    add(postData: AgendaRequestTeamFormModel ): Observable<any> {
        return this._httpClient.post<any>(`${ENDPOINT.agendaRequest.addTeam}`,postData);
    }
}
