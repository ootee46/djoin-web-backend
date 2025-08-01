import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { DataListModel } from 'app/models/data-list.model';
import { InputFormData } from 'app/models/input-form-data';
import { QueryListModel } from 'app/models/query-list.model';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { UserDataService } from '../user.service';
import { UserFormComponent } from '../form/form.component';
import { UserModel } from 'app/models/user.model';
import { UserGroupModel } from 'app/models/user-group.model';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';

@Component({
    selector: 'user-list',
    templateUrl: './list.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class UserListComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('paginator', { static: false }) paginator: MatPaginator;
    @ViewChild('scrollTable', { static: false }) scroll: ElementRef;
    listData$: Observable<DataListModel<UserModel>>;
    isLoading: boolean = false;
    isAdvance: boolean = false;
    searchQuery: QueryListModel = new QueryListModel({});
    userGroups$: Observable<UserGroupModel[]>;
    userInfo: User;
    private _formPopup: MatDialogRef<UserFormComponent>;
    private _unsubscribeAll: Subject<any> = new Subject();
    private _isPageLoad: boolean = false;
    constructor(
        private _matDialog: MatDialog,
        private _service: UserDataService,
        private _userService: UserService,
    ) { }

    ngOnInit(): void {
        this.listData$ = this._service.listData$;
        this.userGroups$ = this._service.userGroups$;
        this._userService.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe((value)=>{
            this.userInfo = value;
        });

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
        const inputData: InputFormData<UserModel> =
            new InputFormData<UserModel>();
        inputData.data = new UserModel({});
        inputData.action = 'add';
        this.openForm(inputData);
    }
    edit(rowData: UserModel): void {
        const inputData: InputFormData<UserModel> = new InputFormData<UserModel>();

        this._service.getData(rowData.id).pipe(takeUntil(this._unsubscribeAll)).subscribe((response: UserModel) => {
            inputData.data = response;
            inputData.action = 'edit';
            this.openForm(inputData);
        });
    }
    deleteData(rowData: UserModel): void {
        Swal.fire({
            title: '',
            text: 'Do you want to delete this item?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
        }).then((result) => {
            if (result.isConfirmed) {
                this._service.delete(rowData.id).subscribe({
                    next: () => {
                        Swal.fire('', 'Data has been deleted.').then(
                            () => {
                                this.loadData();
                            }
                        );
                    },
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
        this.searchQuery.statusId = null;
        this.searchQuery.catId = null;
        this.loadData();
    }

    openForm(input: InputFormData<UserModel>): void {
        this._formPopup = this._matDialog.open(UserFormComponent, {
            panelClass: 'standard-dialog',
            width: '100%',
            height: '100%',
            data: input,
        });
        this._formPopup
            .afterClosed()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((resp: any) => {
                this.loadData();
            });
    }
    toggleAdvanceSearch(): void {
        this.isAdvance = !this.isAdvance;
        if (this.isAdvance === false) {
            this.searchQuery.page = 0;
            this.searchQuery.catId = null;
            this.searchQuery.statusId = null;
            this.loadData();
        }
    }

    getDomain(data: string): string {
        if (data) {
            const splitData = data.split('\\');
            if (Array.isArray(splitData) && splitData.length === 2 && splitData[0]) {
                return splitData[0];
            }
            else {
                return '';
            }
        }
        else {
            return data;
        }
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
