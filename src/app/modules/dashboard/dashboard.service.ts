import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, switchMap, tap } from 'rxjs';
import { DataListModel } from 'app/models/data-list.model';
import { ENDPOINT } from 'app/constants/endpoint';
import { QueryListModel } from 'app/models/query-list.model';
import {
    AgendaRequestItemListModel,
    AgendaRequestItemModel,
    AgendaRequestModel,
} from 'app/models/agenda-request.model';
import {
    MinuteRequestListModel,
    MinuteRequestModel,
} from 'app/models/minute-request.model';
import { PackageInfoModel } from 'app/models/package-info.model';
import { MeetingListModel, MeetingModel } from 'app/models/meeting.model';
import { LineApproveModel } from 'app/models/line-approve.model';
@Injectable({
    providedIn: 'root',
})
export class DashboardService {
    private _agendaApproverDetail: BehaviorSubject<AgendaRequestItemModel | null> =
        new BehaviorSubject(null);
    private _agendaApproves: BehaviorSubject<DataListModel<AgendaRequestItemListModel> | null> =
        new BehaviorSubject(null);
    private _agendaApproveHistories: BehaviorSubject<DataListModel<AgendaRequestItemListModel> | null> =
        new BehaviorSubject(null);
    private _agendaRequests: BehaviorSubject<DataListModel<AgendaRequestModel> | null> =
        new BehaviorSubject(null);
    private _minuteApproves: BehaviorSubject<DataListModel<MinuteRequestListModel> | null> =
        new BehaviorSubject(null);
    private _minuteApproveHistories: BehaviorSubject<DataListModel<MinuteRequestListModel> | null> =
        new BehaviorSubject(null);
    private _minuteApproverDetail: BehaviorSubject<MinuteRequestModel | null> =
        new BehaviorSubject(null);
    private _packageInfo: BehaviorSubject<PackageInfoModel | null> =
        new BehaviorSubject(null);
    private _lineApprove: BehaviorSubject<LineApproveModel[]> =
        new BehaviorSubject(null);
    private _upcomingMeetings: BehaviorSubject<DataListModel<MeetingListModel> | null> =
        new BehaviorSubject(null);
    private _historyMeetings: BehaviorSubject<DataListModel<MeetingListModel> | null> =
        new BehaviorSubject(null);
    constructor(private _httpClient: HttpClient) {}

    get agendaApproverDetail$(): Observable<AgendaRequestItemModel> {
        return this._agendaApproverDetail.asObservable();
    }

    get agendaApproves$(): Observable<
        DataListModel<AgendaRequestItemListModel>
    > {
        return this._agendaApproves.asObservable();
    }
    get agendaApproveHistories$(): Observable<
        DataListModel<AgendaRequestItemListModel>
    > {
        return this._agendaApproveHistories.asObservable();
    }
    get minuteApproveHistories$(): Observable<
        DataListModel<MinuteRequestListModel>
    > {
        return this._minuteApproveHistories.asObservable();
    }

    get minuteApproverDetail$(): Observable<MinuteRequestModel> {
        return this._minuteApproverDetail.asObservable();
    }

    get minuteApproves$(): Observable<DataListModel<MinuteRequestListModel>> {
        return this._minuteApproves.asObservable();
    }
    get agendaRequests$(): Observable<DataListModel<AgendaRequestModel>> {
        return this._agendaRequests.asObservable();
    }
    get packageInfo$(): Observable<PackageInfoModel> {
        return this._packageInfo.asObservable();
    }
    get lineApprove$(): Observable<LineApproveModel[]> {
        return this._lineApprove.asObservable();
    }
    get upcomingMeetings$(): Observable<DataListModel<MeetingListModel>> {
        return this._upcomingMeetings.asObservable();
    }
    get historyMeetings$(): Observable<DataListModel<MeetingListModel>> {
        return this._historyMeetings.asObservable();
    }

    getAgendaApproveDetail(id: number): Observable<AgendaRequestItemModel> {
        return this._httpClient
            .post<AgendaRequestItemModel>(
                `${ENDPOINT.agendaApprove.get}/${id}`,
                null
            )
            .pipe(
                tap((response: any) => {
                    this._agendaApproverDetail.next(
                        new AgendaRequestItemModel(response)
                    );
                })
            );
    }

    getAgendaApproves(
        query: QueryListModel
    ): Observable<DataListModel<AgendaRequestItemListModel>> {
        return this._httpClient
            .post<DataListModel<AgendaRequestItemListModel>>(
                ENDPOINT.agendaApprove.myApprove,
                query
            )
            .pipe(
                tap((response: any) => {
                    this._agendaApproves.next(
                        new DataListModel<AgendaRequestItemListModel>(
                            response,
                            AgendaRequestItemListModel
                        )
                    );
                })
            );
    }

    getAgendaApproveHistories(
        query: QueryListModel
    ): Observable<DataListModel<AgendaRequestItemListModel>> {
        return this._httpClient
            .post<DataListModel<AgendaRequestItemListModel>>(
                ENDPOINT.agendaApprove.myHistory,
                query
            )
            .pipe(
                tap((response: any) => {
                    this._agendaApproveHistories.next(
                        new DataListModel<AgendaRequestItemListModel>(
                            response,
                            AgendaRequestItemListModel
                        )
                    );
                })
            );
    }

    getMinuteApproveHistories(
        query: QueryListModel
    ): Observable<DataListModel<MinuteRequestListModel>> {
        return this._httpClient
            .post<DataListModel<MinuteRequestListModel>>(
                ENDPOINT.minuteApprove.myHistory,
                query
            )
            .pipe(
                tap((response: any) => {
                    this._minuteApproveHistories.next(
                        new DataListModel<MinuteRequestListModel>(
                            response,
                            MinuteRequestListModel
                        )
                    );
                })
            );
    }

    getMinuteagendaApproverDetail(id: number): Observable<MinuteRequestModel> {
        return this._httpClient
            .post<MinuteRequestModel>(
                `${ENDPOINT.minuteApprove.get}/${id}`,
                null
            )
            .pipe(
                tap((response: any) => {
                    this._minuteApproverDetail.next(
                        new MinuteRequestModel(response)
                    );
                })
            );
    }

    getMinuteApproves(
        query: QueryListModel
    ): Observable<DataListModel<MinuteRequestListModel>> {
        return this._httpClient
            .post<DataListModel<MinuteRequestListModel>>(
                ENDPOINT.minuteApprove.myApprove,
                query
            )
            .pipe(
                tap((response: any) => {
                    this._minuteApproves.next(
                        new DataListModel<MinuteRequestListModel>(
                            response,
                            MinuteRequestListModel
                        )
                    );
                })
            );
    }

    getAgendaRequest(
        query: QueryListModel
    ): Observable<DataListModel<AgendaRequestModel>> {
        return this._httpClient
            .post<DataListModel<AgendaRequestModel>>(
                ENDPOINT.agendaRequest.search,
                query
            )
            .pipe(
                tap((response: any) => {
                    this._agendaRequests.next(
                        new DataListModel<AgendaRequestModel>(
                            response,
                            AgendaRequestModel
                        )
                    );
                })
            );
    }

    getPackageInfo(): Observable<PackageInfoModel> {
        return this._httpClient
            .post<PackageInfoModel>(ENDPOINT.package.info, null)
            .pipe(
                tap((response: any) => {
                    if (response) {
                        this._packageInfo.next(new PackageInfoModel(response));
                    } else {
                        this._packageInfo.next(null);
                    }
                })
            );
    }

    getLineApprove(): Observable<LineApproveModel[]> {
        return this._httpClient
            .post<LineApproveModel[]>(ENDPOINT.common.lineApproved, null)
            .pipe(
                tap((response: any) => {
                    if (response) {
                        this._lineApprove.next(response);
                    } else {
                        this._lineApprove.next(null);
                    }
                })
            );
    }

    getUpcommingMeeting(
        query: QueryListModel
    ): Observable<DataListModel<MeetingListModel>> {
        query.status = 'upcoming';
        return this._httpClient
            .post<DataListModel<MeetingListModel>>(
                ENDPOINT.meeting.search,
                query
            )
            .pipe(
                tap((response: any) => {
                    this._upcomingMeetings.next(
                        new DataListModel<MeetingListModel>(
                            response,
                            MeetingListModel
                        )
                    );
                })
            );
    }

    getHistoryMeeting(
        query: QueryListModel
    ): Observable<DataListModel<MeetingListModel>> {
        query.status = 'history';
        return this._httpClient
            .post<DataListModel<MeetingListModel>>(
                ENDPOINT.meeting.search,
                query
            )
            .pipe(
                tap((response: any) => {
                    this._historyMeetings.next(
                        new DataListModel<MeetingListModel>(
                            response,
                            MeetingListModel
                        )
                    );
                })
            );
    }
}
