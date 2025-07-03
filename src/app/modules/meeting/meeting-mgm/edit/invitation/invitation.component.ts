import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { InputFormData } from 'app/models/input-form-data';
import { QueryListModel } from 'app/models/query-list.model';
import { BehaviorSubject, Observable, Subject, take, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { InvitationService } from './invitation.service';
import { InvitationFormComponent } from './form/form.component';
import { InvitationModel } from 'app/models/invitation.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MemberUserModel } from 'app/models/member-user.model';
import { MatPaginator } from '@angular/material/paginator';
import { DataListModel } from 'app/models/data-list.model';


@Component({
    selector: 'meeting-invitation',
    templateUrl: './invitation.component.html'
})
export class InvitationComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('paginator', { static: false }) paginator: MatPaginator;
    @ViewChild('scrollTable', { static: false }) scroll: ElementRef;
    listData$: Observable<DataListModel<InvitationModel>>;
    searchQuery: QueryListModel = new QueryListModel({});
    meetingId: number;
    isLoading: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private _isPageLoad: boolean = false;
    private _formPopup: MatDialogRef<InvitationFormComponent>;
    constructor(
        private _matDialog: MatDialog,
        private _service: InvitationService,
        private _route: ActivatedRoute,
    ) { }


    ngOnInit(): void {
        this.listData$ = this._service.listData$;
        this.meetingId = parseInt(this._route.snapshot.paramMap.get('id'), 10);

        if (this.meetingId) {
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
    create(): void {
        const inputData: InputFormData<InvitationModel> = new InputFormData<InvitationModel>();
        inputData.data = new InvitationModel({});
        inputData.data.meetingId = this.meetingId;
        inputData.action = 'add';
        this.openForm(inputData);
    }

    loadData(): void {
        this.searchQuery.pageSize = (this.paginator ? this.paginator.pageSize : this.searchQuery.pageSize);
        this._service.getDatas(this.searchQuery).pipe(take(1)).subscribe(()=>{
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
    clearSearch(): void {
        this.searchQuery.page = 0;
        this.searchQuery.kw = null;
        this.loadData();
    }
    openForm(input: InputFormData<InvitationModel>): void {
        this._formPopup = this._matDialog.open(InvitationFormComponent, {
            panelClass: 'standard-dialog',
            width: '100%',
            height: '80vh',
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
