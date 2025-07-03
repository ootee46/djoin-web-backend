import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { fuseAnimations } from '@fuse/animations';
import { DataListModel } from 'app/models/data-list.model';
import { LoginLogModel } from 'app/models/login-log.model';
import { QueryListModel } from 'app/models/query-list.model';
import { Observable, Subject, take, takeUntil } from 'rxjs';

import { FailLoginLogService } from '../fail-login-log.service';


@Component({
    selector: 'fail-login-log-list',
    templateUrl: './list.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class FailLoginLogListComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('paginator', { static: false }) paginator: MatPaginator;
    @ViewChild('scrollTable', { static: false }) scroll: ElementRef;
    listData$: Observable<DataListModel<LoginLogModel>>;
    isLoading: boolean = false;
    searchQuery: QueryListModel = new QueryListModel({});
    private _unsubscribeAll: Subject<any> = new Subject();
    private _isPageLoad: boolean = false;
    constructor(
        private _service: FailLoginLogService,
    ) { }

    ngOnInit(): void {
        this.listData$ = this._service.listData$;
    }
    ngAfterViewInit(): void {
        if (this.paginator) {
            if (!this._isPageLoad) {
                this._isPageLoad = true;
                this.paginator.page.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
                    this.searchQuery.page = (this.paginator ? this.paginator.pageIndex : 0);
                    this.searchQuery.pageSize = (this.paginator ? this.paginator.pageSize : this.searchQuery.pageSize);
                    this.loadData();
                });
            }
        }
    }
    loadData(): void {
        this.searchQuery.pageSize = (this.paginator ? this.paginator.pageSize : this.searchQuery.pageSize);
        this._service.getDatas(this.searchQuery).pipe(take(1)).subscribe(() => {
            if (this.paginator) {
                if (!this._isPageLoad) {
                    this._isPageLoad = true;
                    this.paginator.page.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
                        this.searchQuery.page = (this.paginator ? this.paginator.pageIndex : 0);
                        this.searchQuery.pageSize = (this.paginator ? this.paginator.pageSize : this.searchQuery.pageSize);
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
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
