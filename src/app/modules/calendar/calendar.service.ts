import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENDPOINT } from 'app/constants/endpoint';
import { MeetingModel } from 'app/models/meeting.model';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private _data: BehaviorSubject<MeetingModel[] | null> = new BehaviorSubject(null);
  constructor(private _httpClient: HttpClient) {
  }
  get datas$(): Observable<MeetingModel[] > {
    return this._data.asObservable();
  }

  getCalendar(): Observable<MeetingModel[]> {
    return this._httpClient.post<MeetingModel[]>(ENDPOINT.meeting.getAll, null).pipe(
      tap((response: any) => {
        this._data.next(response.map(c=> new MeetingModel(c)));
      })
    );

  }
}
