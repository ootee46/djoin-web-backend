import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { DataListModel } from 'app/models/data-list.model';
import { DownloadLogModel } from 'app/models/download-log.model';
import { QueryListModel } from 'app/models/query-list.model';
import { BehaviorSubject, Observable, Subject, take, takeUntil } from 'rxjs';
import { FileOpenService } from './file-open.service';

@Component({
  selector: 'file-open',
  templateUrl: './file-open.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class FileOpenComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('paginator', { static: false }) paginator: MatPaginator;
    @ViewChild('scrollTable', { static: false }) scroll: ElementRef;
    _isFirstLoad: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    listData$: Observable<DataListModel<DownloadLogModel>>;
    searchQuery: QueryListModel = new QueryListModel({});
    meetingId: number;
    isLoading: boolean = false;
    sortTemplate: {
        fieldName: string,
        sort: 'asc' | 'desc'
    }
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private _isPageLoad: boolean = false;

    constructor(
        private _service: FileOpenService,
        private _route: ActivatedRoute,
        private _spalsh: FuseSplashScreenService,
    ) { }

    get isFirstLoad$(): Observable<boolean> {
        return this._isFirstLoad.asObservable();
    }

    ngOnInit(): void {
        this.listData$ = this._service.listData$;
        this.meetingId = parseInt(this._route.snapshot.paramMap.get('id'), 10);
        this.sortTemplate = {
            fieldName: 'Name',
            sort: 'asc'
        }
        if(this.meetingId){
            this.searchQuery.catId = this.meetingId;
        }
    }
    ngAfterViewInit(): void {
        if(this.paginator){
            if(!this._isPageLoad){
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
        this.searchQuery.fieldsort = this.sortTemplate.fieldName;
        this.searchQuery.sort = this.sortTemplate.sort;
        this._service.getDatas(this.searchQuery).pipe(take(1)).subscribe(()=>{
            this._isFirstLoad.next(true);
            if(this.paginator){
                if(!this._isPageLoad){
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
    doSearch(): void{
        this.searchQuery.page = 0;
        this.loadData();
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    setTemplateSort(key: string): void {
        if (key === this.sortTemplate.fieldName) {
            this.sortTemplate.sort = this.sortTemplate.sort === 'asc' ? 'desc' : 'asc'
        } else {
            this.sortTemplate.fieldName = key
            this.sortTemplate.sort = 'asc'
        }
        this.loadData();
    }
}
