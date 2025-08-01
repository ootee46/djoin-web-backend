import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENDPOINT } from 'app/constants/endpoint';
import { MeetingAttendeeModel } from 'app/models/attendee.model';
import { MemberUserModel } from 'app/models/member-user.model';
import { GlobalService } from 'app/services/global.service';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class JoinResultService {
    private _datas: BehaviorSubject<MeetingAttendeeModel[] | null> = new BehaviorSubject(null);
    private _adminUsers: BehaviorSubject<MemberUserModel[] | null> = new BehaviorSubject(null);
    constructor(private _httpClient: HttpClient, private _globalService: GlobalService) {
    }
    get datas$(): Observable<MeetingAttendeeModel[]> {
        return this._datas.asObservable();
    }

    getDatas(id: number): Observable<MeetingAttendeeModel[]> {
        return this._httpClient.post<MeetingAttendeeModel[]>(ENDPOINT.meetingAttendee.search.concat('/').concat(id.toString()),null).pipe(
            tap((response: any) => {
                this._datas.next(response.map(c=>new MeetingAttendeeModel(c)));
            })
        );
    }

}
