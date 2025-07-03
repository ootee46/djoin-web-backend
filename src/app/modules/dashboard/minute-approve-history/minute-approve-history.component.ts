import {
    AfterViewInit,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { DataListModel } from 'app/models/data-list.model';
import { MinuteRequestListModel, MinuteRequestModel } from 'app/models/minute-request.model';
import { QueryListModel } from 'app/models/query-list.model';
import { Observable, Subject, take, takeUntil } from 'rxjs';

import { DashboardService } from '../dashboard.service';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { StandardModel } from 'app/models/standard.model';
import { MeetingMgmService } from 'app/modules/meeting/meeting-mgm/meeting-mgm.service';

@Component({
    selector: 'dashboard-minute-approve-history',
    templateUrl: './minute-approve-history.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class DashboardMinuteApproveHistoryComponent
    implements OnInit, OnDestroy, AfterViewInit
{
    @ViewChild('paginator', { static: false }) paginator: MatPaginator;
    @ViewChild('scrollTable', { static: false }) scroll: ElementRef;
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    meetingGroups$: Observable<StandardModel[]>;
    meetingTypes$: Observable<StandardModel[]>;
    listData$: Observable<DataListModel<MinuteRequestListModel>>;
    detail$: Observable<MinuteRequestModel>;
    isLoading: boolean = false;
    isAdvance: boolean = false;
    searchQuery: QueryListModel = new QueryListModel({});
    private _unsubscribeAll: Subject<any> = new Subject();
    private _isPageLoad: boolean = false;
    constructor(
        private _service: DashboardService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _meetingService: MeetingMgmService,
        private _splash: FuseSplashScreenService
    ) {}

    ngOnInit(): void {
        this.listData$ = this._service.minuteApproveHistories$;
        this.detail$ = this._service.minuteApproverDetail$;
        this.meetingGroups$ = this._meetingService.meetingGroups$;
        this.meetingTypes$ = this._meetingService.meetingTypes$;
    }

    loadData(): void {
        this.searchQuery.pageSize = this.paginator
            ? this.paginator.pageSize
            : this.searchQuery.pageSize;
        this._service
            .getMinuteApproveHistories(this.searchQuery)
            .pipe(take(1))
            .subscribe(() => {
                if (this.paginator) {
                    if (!this._isPageLoad) {
                        this._isPageLoad = true;
                        this.paginator.page
                            .pipe(takeUntil(this._unsubscribeAll))
                            .subscribe(() => {
                                this.searchQuery.page = this.paginator
                                    ? this.paginator.pageIndex
                                    : 0;
                                this.searchQuery.pageSize = this.paginator
                                    ? this.paginator.pageSize
                                    : this.searchQuery.pageSize;
                                this.loadData();
                            });
                    }
                }
            });
    }
    doSearch(): void {
        this.searchQuery.page = 0;
        this.loadData();
    }

    clearSearch(): void {
        this.searchQuery.page = 0;
        this.searchQuery.kw = null;
        this.loadData();
    }

    toggleAdvanceSearch(): void {
        this.isAdvance = !this.isAdvance;
    }

    ngAfterViewInit(): void {
        if (this.paginator) {
            if (!this._isPageLoad) {
                this._isPageLoad = true;
                this.paginator.page
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe(() => {
                        this.searchQuery.page = this.paginator
                            ? this.paginator.pageIndex
                            : 0;
                        this.searchQuery.pageSize = this.paginator
                            ? this.paginator.pageSize
                            : this.searchQuery.pageSize;
                        this.loadData();
                    });
            }
        }
    }
    viewDetal(item: MinuteRequestListModel): void {
        this._splash.show();
        this._service.getMinuteagendaApproverDetail(item.id).pipe(take(1)).subscribe(() => {
            this._splash.hide();
            this.matDrawer.open();
            setTimeout(() => {
                this.matDrawer._content.nativeElement.scrollTop = 0;
            }, 100);
        });
    }

    closeDetail(): void {
        this.matDrawer.close();
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
