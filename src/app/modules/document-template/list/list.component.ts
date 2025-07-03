import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { DataListModel } from 'app/models/data-list.model';
import { InputFormData } from 'app/models/input-form-data';
import { QueryListModel } from 'app/models/query-list.model';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { DocumentTemplateService } from '../document-template.service';
import { DocumentTemplateListModel, DocumentTemplateModel } from 'app/models/document-template.model';


@Component({
    selector: 'document-template-list',
    templateUrl: './list.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class DocumentTemplateListComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('paginator', { static: false }) paginator: MatPaginator;
    @ViewChild('scrollTable', { static: false }) scroll: ElementRef;
    listData$: Observable<DataListModel<DocumentTemplateListModel>>;
    isLoading: boolean = false;
    sortTemplate: {
        fieldName: string,
        sort: 'asc' | 'desc'
    }
    searchQuery: QueryListModel = new QueryListModel({});
    private _unsubscribeAll: Subject<any> = new Subject();
    private _isPageLoad: boolean = false;

    constructor(
        private _matDialog: MatDialog,
        private _service: DocumentTemplateService,
    ) { }

    ngOnInit(): void {
        this.listData$ = this._service.listData$;
        this.sortTemplate = {
            fieldName: 'Name',
            sort: 'asc'
        }
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
        this.searchQuery.fieldsort = this.sortTemplate.fieldName;
        this.searchQuery.sort = this.sortTemplate.sort;
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
    doSearch(): void{
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
