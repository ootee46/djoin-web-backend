import { AfterContentChecked, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { fuseAnimations } from '@fuse/animations';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import {
    AgendaRequestAttachmentModel,
    AgendaRequestAttachmentPermissionFormModel,
    AgendaRequestAttachmentPermissionModel,
} from 'app/models/agenda-request.model';
import { InputFormData } from 'app/models/input-form-data';
import { StandardModel } from 'app/models/standard.model';
import { UserModel } from 'app/models/user.model';
import { BehaviorSubject, forkJoin, Observable, Subject, take, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { AgendaReserveService } from '../../agenda-reserve.service';

@Component({
    selector: 'request-info-attachment-permission',
    templateUrl: './permission.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class RequestInfoDocumentPermissionComponent implements OnInit, OnDestroy, AfterContentChecked {
    @ViewChild('myForm') myForm: NgForm;
    action: string;
    datas: AgendaRequestAttachmentModel[] = [];
    dataForm: UntypedFormGroup;
    permissions: AgendaRequestAttachmentPermissionModel[] = [];
    isReadAll: boolean = false;
    isDownloadAll: boolean = false;
    users: UserModel[] = [];
    groupId: number;
    userId: number;
    userGroups$: Observable<StandardModel[]>;
    users$: Observable<UserModel[]>;
    id: number;
    _filterPermissions: BehaviorSubject<AgendaRequestAttachmentPermissionModel[]> = new BehaviorSubject<AgendaRequestAttachmentPermissionModel[]>([]);
    private _unsubscribeAll: Subject<any> = new Subject();
    constructor(
        private _matDialogRef: MatDialogRef<RequestInfoDocumentPermissionComponent>,
        @Inject(MAT_DIALOG_DATA) private input: InputFormData<AgendaRequestAttachmentModel[]>,
        private _spalsh: FuseSplashScreenService,
        private _service: AgendaReserveService
    ) { }

    get filterPermissions$(): Observable<AgendaRequestAttachmentPermissionModel[]>
    {
        return this._filterPermissions.asObservable();
    }

    ngOnInit(): void {
        this.action = this.input.action;
        this.datas = this.input.data;
        this.permissions = this.datas[0].permissions;
        if(this.datas.length > 1){
            this.permissions.forEach((item)=>{
                item.isDownload = true;
                item.isRead = true;
            });
        }

        // setTimeout(() => {
        //     this._service.getUser(null).pipe(take(1)).subscribe(()=>{
        //         this._spalsh.hide();
        //     });
        //     this._service.getUserGroup().pipe(take(1)).subscribe();
        // }, 0);
        this.users$ = this._service.attendeeUsers$;
        this.userGroups$ = this._service.userGroups$;
        this.users$.pipe(takeUntil(this._unsubscribeAll)).subscribe((values)=>{
            if(values && Array.isArray(values)){
                const userIds = values.map(c=>c.id);
                const curentPermissions = this.permissions.filter(c=>userIds.includes(c.userId));
                this._filterPermissions.next(curentPermissions);
            }
            else{
                this._filterPermissions.next(this.permissions);
            }
        });
        // this._service.users$.pipe(takeUntil(this._unsubscribeAll)).subscribe((value)=>{
        //     this.users = value;
        //     const nonExistUsers = this.users.filter(c=>!this.permissions.map(a=>a.userId).includes(c.id));
        //     nonExistUsers.forEach((element) => {
        //         const obj = new AgendaRequestAttachmentPermissionModel({});
        //         obj.id = 0;
        //         obj.attachmentId = 0;
        //         obj.userId = element.id;
        //         obj.name = element.name;
        //         obj.isRead = true;
        //         obj.isDownload = true;
        //         this.permissions.push(obj);
        //     });
        // });
        // this.dataForm = this.createDataForm();
        // this.adminUsers$ = this._service.adminUsers$;
        // this._service.getAdminUser().pipe(takeUntil(this._unsubscribeAll)).subscribe();
    }

    toggleRead(): void{
        const curentPermissions = this._filterPermissions.getValue();
        curentPermissions.forEach((element) => {
            element.isRead = this.isReadAll;
        });
        this._filterPermissions.next(curentPermissions);
    }
    toggleDownload(): void{
        const curentPermissions = this._filterPermissions.getValue();
        curentPermissions.forEach((element) => {
            element.isDownload = this.isDownloadAll;
        });
        this._filterPermissions.next(curentPermissions);
    }

    getUser(value: number): void{
        if(value){
            this._service.getUser(value.toString()).pipe(takeUntil(this._unsubscribeAll)).subscribe();
        }else{
            this._filterPermissions.next(this.permissions);
        }
    }

    filterUser(value: number): void{
        if(value){
            const curentPermissions = this.permissions.filter(c=>c.userId === value);
            this._filterPermissions.next(curentPermissions);
        }
        else{
            this.getUser(null);
        }
    }

    saveData(): void {

        Swal.fire({
            title: '',
            text: 'Do you want to save your changes ?',
            showCancelButton: true,
            confirmButtonText: 'Save',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                this.permissions = this.permissions.filter(c=>c.isDownload === false || c.isRead === false);
                this.datas.forEach((element)=>{
                  element.permissions = this.permissions;
                });
                Swal.fire('', 'Data was added').then(() => {
                    this._matDialogRef.close();
                });
            }
        });
    }


    setPermission(value: AgendaRequestAttachmentPermissionModel): void{
        if(this.datas.length > 1){
            const postRequests: any = [];
            this.permissions.forEach((permission)=>{
                this.datas.forEach((item)=>{
                    const postData = new AgendaRequestAttachmentPermissionFormModel(permission);
                    if(this.datas.length > 0){
                        postData.id = 0;
                    }
                    postData.agendaRequestItemId = item.agendaRequestItemId;
                    postData.attachmentId = item.attachmentId;
                    postRequests.push(this._service.updatePermission(postData));
                });
            });
            forkJoin(postRequests).pipe(takeUntil(this._unsubscribeAll))
            .subscribe(()=>{});
        }else{
            const postRequests: any = [];
            this.datas.forEach((item)=>{
                const postData = new AgendaRequestAttachmentPermissionFormModel(value);
                if(this.datas.length > 0){
                    postData.id = 0;
                }
                postData.agendaRequestItemId = item.agendaRequestItemId;
                postData.attachmentId = item.attachmentId;
                postRequests.push(this._service.updatePermission(postData));
            });
            forkJoin(postRequests).pipe(takeUntil(this._unsubscribeAll))
            .subscribe(()=>{});
        }

    }

    close(): void {
        this._matDialogRef.close();
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    ngAfterContentChecked(): void {

    }

}
