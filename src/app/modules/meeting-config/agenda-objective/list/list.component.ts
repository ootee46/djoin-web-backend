import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { DataListModel } from 'app/models/data-list.model';
import { InputFormData } from 'app/models/input-form-data';
import { QueryListModel } from 'app/models/query-list.model';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { AgendaObjectiveService } from '../agenda-objective.service';
import { AgendaObjectiveFormComponent } from '../form/form.component';
import { AgendaObjectiveModel } from 'app/models/standard.model';


@Component({
    selector: 'agenda-objective-list',
    templateUrl: './list.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AgendaObjectiveListComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('paginator', { static: false }) paginator: MatPaginator;
    @ViewChild('scrollTable', { static: false }) scroll: ElementRef;
    listData$: Observable<DataListModel<AgendaObjectiveModel>>;
    isLoading: boolean = false;
    searchQuery: QueryListModel = new QueryListModel({});
    private _formPopup: MatDialogRef<AgendaObjectiveFormComponent>;
    private _unsubscribeAll: Subject<any> = new Subject();
    private _isPageLoad: boolean = false;
    constructor(
        private _matDialog: MatDialog,
        private _service: AgendaObjectiveService,
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
    create(): void {
        const inputData: InputFormData<AgendaObjectiveModel> = new InputFormData<AgendaObjectiveModel>();
        inputData.data = new AgendaObjectiveModel({});
        inputData.action = 'add';
        this.openForm(inputData);
    }
    edit(rowData: AgendaObjectiveModel): void {
        const inputData: InputFormData<AgendaObjectiveModel> = new InputFormData<AgendaObjectiveModel>();
        this._service.getData(rowData.id).pipe(takeUntil(this._unsubscribeAll)).subscribe((response: AgendaObjectiveModel) => {
            inputData.data = response;
            inputData.action = 'edit';
            this.openForm(inputData);
        });
    }
    deleteData(rowData: AgendaObjectiveModel): void {
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
    doSearch(): void {
        this.searchQuery.page = 0;
        this.loadData();
    }
    clearSearch(): void {
        this.searchQuery.page = 0;
        this.searchQuery.kw = null;
        this.loadData();
    }

    openForm(input: InputFormData<AgendaObjectiveModel>): void {
        this._formPopup = this._matDialog.open(AgendaObjectiveFormComponent, {
            panelClass: 'standard-dialog',
            width: '100%',
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
