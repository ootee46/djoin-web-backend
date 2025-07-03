import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { DataListModel } from 'app/models/data-list.model';
import { InputFormData } from 'app/models/input-form-data';
import { QueryListModel } from 'app/models/query-list.model';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { AgendaReserveFormComponent } from '../form/form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AgendaRequestItemListModel, AgendaRequestItemModel, AgendaRequestModel } from 'app/models/agenda-request.model';
import { AgendaReserveService } from '../agenda-reserve.service';

@Component({
    selector: 'agenda-reserve-list',
    templateUrl: './list.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AgendaReserveListComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('paginator', { static: false }) paginator: MatPaginator;
    @ViewChild('scrollTable', { static: false }) scroll: ElementRef;
    listData$: Observable<DataListModel<AgendaRequestModel>>;
    isLoading: boolean = false;
    isAdvance: boolean = false;
    searchQuery: QueryListModel = new QueryListModel({});
    private _formPopup: MatDialogRef<AgendaReserveFormComponent>;
    private _unsubscribeAll: Subject<any> = new Subject();
    private _isPageLoad: boolean = false;
    constructor(
        private _matDialog: MatDialog,
        private _service: AgendaReserveService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
    ) { }

    ngOnInit(): void {
        this.listData$ = this._service.listData$;
        // setTimeout(() => {
        //     this.create();
        // }, 100);
        // this.create();
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
    create(): void {
        const inputData: InputFormData<AgendaRequestModel> = new InputFormData<AgendaRequestModel>();
        inputData.data = new AgendaRequestModel({});
        inputData.action = 'add';
        this.openForm(inputData);
    }
    edit(rowData: AgendaRequestModel): void {
        const inputData: InputFormData<AgendaRequestModel> = new InputFormData<AgendaRequestModel>();
        inputData.data = rowData;
        inputData.action = 'edit';
        this.openForm(inputData);
    }
    viewDetal(rowData: AgendaRequestItemModel): void {
        this._router.navigate(['detail', rowData.id], { relativeTo: this._activatedRoute });
    }
    deleteData(rowData: AgendaRequestItemListModel): void {
        Swal.fire({
            title: '',
            text: 'Do you want to delete this item?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                this._service.delete(rowData.id).subscribe({
                    next: () => {
                        Swal.fire('', 'Data has been deleted.').then(() => { this.loadData(); });
                    }
                });
            }
        });
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
    toggleAdvanceSearch(): void {
        this.isAdvance = !this.isAdvance;
        if (this.isAdvance === false) {
            this.searchQuery.page = 0;
            this.searchQuery.start_date = null;
            this.searchQuery.end_date = null;
            this.searchQuery.start_date2 = null;
            this.searchQuery.end_date2 = null;
            this.loadData();
        }
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


    openForm(input: InputFormData<AgendaRequestModel>): void {
        this._formPopup = this._matDialog.open(AgendaReserveFormComponent, {
            panelClass: 'standard-dialog',
            width: '100%',
            height: '99%',
            data: input
        });
        this._formPopup.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe((resp: any) => {
            this.loadData();
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
