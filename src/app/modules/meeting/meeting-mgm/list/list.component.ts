import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { DataListModel } from 'app/models/data-list.model';
import { InputFormData } from 'app/models/input-form-data';
import { QueryListModel } from 'app/models/query-list.model';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MeetingMgmService } from '../meeting-mgm.service';
import { MeetingMgmFormComponent } from '../form/form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MeetingListModel, MeetingModel } from 'app/models/meeting.model';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { StandardModel } from 'app/models/standard.model';


@Component({
    selector: 'meeting-mgm-list',
    templateUrl: './list.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class MeetingMgmListComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('paginator', { static: false }) paginator: MatPaginator;
    @ViewChild('scrollTable', { static: false }) scroll: ElementRef;
    listData$: Observable<DataListModel<MeetingListModel>>;
    meetingGroups$: Observable<StandardModel[]>;
    isLoading: boolean = false;
    isAdvance: boolean = false;
    searchQuery: QueryListModel = new QueryListModel({});
    private _formPopup: MatDialogRef<MeetingMgmFormComponent>;
    private _unsubscribeAll: Subject<any> = new Subject();
    private _isPageLoad: boolean = false;
    constructor(
        private _matDialog: MatDialog,
        private _service: MeetingMgmService,
        private _router: Router,
        private _splash: FuseSplashScreenService,
        private _activateRoute: ActivatedRoute,
    ) { }

    ngOnInit(): void {
        this.searchQuery.catId = null;
        this.listData$ = this._service.listData$;
        this.meetingGroups$ = this._service.meetingGroups$;
        //  this.create();
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
    toggleAdvanceSearch(): void {
        this.isAdvance = !this.isAdvance;
        if (this.isAdvance === false) {
            this.searchQuery.page = 0;
            this.searchQuery.start_date = null;
            this.searchQuery.end_date = null;
            this.loadData();
        }
    }
    create(): void {
        const inputData: InputFormData<MeetingModel> = new InputFormData<MeetingModel>();
        inputData.data = new MeetingModel({});
        inputData.action = 'add';
        this.openForm(inputData);
    }
    edit(rowData: MeetingListModel): void {
        this._router.navigate(['edit', rowData.id], { relativeTo: this._activateRoute });
    }
    deleteData(rowData: MeetingListModel): void {
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
        this.searchQuery.start_date = null;
        this.searchQuery.end_date = null;
        this.loadData();
    }
    duplicate(data: MeetingListModel): void {
        Swal.fire({
            title: '',
            text: 'Do you want to duplicate this Meeting?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                this._splash.show();
                this._service.duplicate(data.id).pipe(take(1)).subscribe(() => {
                    this._splash.hide();
                    Swal.fire('', 'Meeting has been duplicated').then(() => {
                        this.loadData();
                    });
                });
            }
        });
    }


    openForm(input: InputFormData<MeetingListModel>): void {
        this._formPopup = this._matDialog.open(MeetingMgmFormComponent, {
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
