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
import { AgendaRequestItemListModel } from 'app/models/agenda-request.model';
import { DataListModel } from 'app/models/data-list.model';
import { QueryListModel } from 'app/models/query-list.model';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { DashboardService } from '../dashboard.service';

@Component({
    selector: 'dashboard-agenda-approve',
    templateUrl: './agenda-approve.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class DashboardAgendaApproveComponent
    implements OnInit, OnDestroy, AfterViewInit
{
    @ViewChild('paginator', { static: false }) paginator: MatPaginator;
    @ViewChild('scrollTable', { static: false }) scroll: ElementRef;
    listData$: Observable<DataListModel<AgendaRequestItemListModel>>;
    isLoading: boolean = false;
    isAdvance: boolean = false;
    searchQuery: QueryListModel = new QueryListModel({});
    private _unsubscribeAll: Subject<any> = new Subject();
    private _isPageLoad: boolean = false;
    constructor(
        private _service: DashboardService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.listData$ = this._service.agendaApproves$;
    }

    loadData(): void {
        this.searchQuery.pageSize = this.paginator
            ? this.paginator.pageSize
            : this.searchQuery.pageSize;
        this._service
            .getAgendaApproves(this.searchQuery)
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

    doSearch(): void {}

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
    viewDetal(item: AgendaRequestItemListModel): void {
        this._router.navigate(['/approver/agenda-approve/detail', item.id], {
            relativeTo: this._activatedRoute,
        });
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
