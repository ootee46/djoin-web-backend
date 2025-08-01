import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FollowUpModel } from 'app/models/follow-up.model';
import { QueryListModel } from 'app/models/query-list.model';
import { BehaviorSubject, Observable, Subject, take, takeUntil } from 'rxjs';
import { FollowUpService } from './follow-up.service';
import { fuseAnimations } from '@fuse/animations';
import { InputFormData } from 'app/models/input-form-data';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FollowUpFormComponent } from './form/form.component';
import { MatPaginator } from '@angular/material/paginator';
import { DataListModel } from 'app/models/data-list.model';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';

@Component({
  selector: 'follow-up',
  templateUrl: './follow-up.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class FollowUpComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('paginator', { static: false }) paginator: MatPaginator;
    @ViewChild('scrollTable', { static: false }) scroll: ElementRef;
    _isFirstLoad: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    listData$: Observable<DataListModel<FollowUpModel>>;
    searchQuery: QueryListModel = new QueryListModel({});
    meetingId: number;
    isLoading: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private _formPopup: MatDialogRef<FollowUpFormComponent>;
    private _isPageLoad: boolean = false;
    constructor(
        private _service: FollowUpService,
        private _route: ActivatedRoute,
        private _matDialog: MatDialog,
        private _spalsh: FuseSplashScreenService,
    ) { }

    get isFirstLoad$(): Observable<boolean> {
        return this._isFirstLoad.asObservable();
    }


    ngOnInit(): void {
        this.listData$ = this._service.listData$;
        this.meetingId = parseInt(this._route.snapshot.paramMap.get('id'), 10);
        if(this.meetingId){
            this.searchQuery.catId = this.meetingId;
        }

        // setTimeout(() => {
        //     this.create();
        // }, 1000);
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

    doSearch(): void{
        this.searchQuery.page = 0;
        this.loadData();
    }

    loadData(): void {
        this.searchQuery.pageSize = (this.paginator ? this.paginator.pageSize : this.searchQuery.pageSize);
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

    create(): void {
        const inputData: InputFormData<FollowUpModel> = new InputFormData<FollowUpModel>();
        inputData.data = new FollowUpModel({});
        inputData.data.meetingId = this.meetingId;
        inputData.action = 'add';
        this.openForm(inputData);
    }
    edit(rowData: FollowUpModel): void {
        this._spalsh.show();
        this._service.getData(rowData.id).pipe(take(1)).subscribe((value)=>{
            this._spalsh.hide();
            const inputData: InputFormData<FollowUpModel> = new InputFormData<FollowUpModel>();
            inputData.data = value;
            inputData.action = 'edit';
            this.openForm(inputData);
        });

    }
    deleteData(rowData: FollowUpModel): void{
        Swal.fire({
            title: '',
            text: 'Do you want to delete this item?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if(result.isConfirmed){
                this._service.delete(rowData.id).subscribe({
                    next: ()=>{
                        Swal.fire('','Data has been deleted.').then(()=>{ this.loadData(); });
                    }
                });
            }
        });
    }
    openForm(input: InputFormData<FollowUpModel>): void{
        this._formPopup = this._matDialog.open(FollowUpFormComponent, {
            panelClass: 'standard-dialog',
            width: '100%',
            height: '80vh',
            data: input
        });
        this._formPopup.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe((resp: any) => {
            this.loadData();
        });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}
