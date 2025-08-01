import { AfterContentChecked, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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

import { AgendaReserveService } from '../../agenda-reserve.service';
import { UploadDocumentService } from '../upload-document.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'meeting-agenda-attachment-permission',
    templateUrl: './permission.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class DocumentPermissionComponent implements OnInit, OnDestroy, AfterContentChecked {
    @ViewChild('myForm') myForm: NgForm;
    action: string;
    datas: AgendaRequestAttachmentModel[] = [];
    dataForm: UntypedFormGroup;
    isReadAll: boolean = false;
    isDownloadAll: boolean = false;
    permissions: AgendaRequestAttachmentPermissionModel[] = [];
    groupId: number;
    userId: number;
    userGroups$: Observable<StandardModel[]>;
    users$: Observable<UserModel[]>;
    users: UserModel[];
    id: number;
    private _filterPermissions: BehaviorSubject<AgendaRequestAttachmentPermissionModel[]> = new BehaviorSubject<AgendaRequestAttachmentPermissionModel[]>([]);
    private _unsubscribeAll: Subject<any> = new Subject();
    private _filterUsers: BehaviorSubject<UserModel[] | null> = new BehaviorSubject(null);
    constructor(
        private _matDialogRef: MatDialogRef<DocumentPermissionComponent>,
        @Inject(MAT_DIALOG_DATA) private input: InputFormData<AgendaRequestAttachmentModel[]>,
        private _spalsh: FuseSplashScreenService,
        private _service: UploadDocumentService,
        private _reserveService: AgendaReserveService
    ) { }

    get filterPermissions$(): Observable<AgendaRequestAttachmentPermissionModel[]>
    {
        return this._filterPermissions.asObservable();
    }
    get filterUsers$(): Observable<UserModel[]>
    {
        return this._filterUsers.asObservable();
    }

    ngOnInit(): void {
        this.action = this.input.action;
        this.datas = this.input.data;
        this.permissions = this.datas[0].permissions;
        if(!this.datas || this.datas.length === 0){
            this.close();
        }
        if(this.datas.length > 1){
            this.permissions.forEach((item)=>{
                item.isDownload = true;
                item.isRead = true;
            });

            this.permissions.sort((a, b) => a.name.localeCompare(b.name));
        } else {
            this.permissions = this.permissions.sort((a, b) => {
            if (a.isRead !== b.isRead) {
                return Number(b.isRead) - Number(a.isRead);
            }

            if (a.isDownload !== b.isDownload) {
                return Number(b.isDownload) - Number(a.isDownload);
            }

                return a.name.localeCompare(b.name);
            });
        }

        // setTimeout(() => {
        //     this._reserveService.getUser(null).pipe(take(1)).subscribe(()=>{
        //         this._spalsh.hide();
        //     });
        //     this._reserveService.getUserGroup().pipe(take(1)).subscribe();
        // }, 0);
        this.users$ = this._reserveService.attendeeUsers$;
        this.userGroups$ = this._reserveService.userGroups$;
        this.users$.pipe(takeUntil(this._unsubscribeAll)).subscribe((values)=>{
            if(values && Array.isArray(values)){
                this._filterUsers.next(values);
                this.users = values;
                const userIds = values.map(c=>c.id);
                const curentPermissions = this.permissions.filter(c=>userIds.includes(c.userId));
                this._filterPermissions.next(curentPermissions);
            }
            else{
                this.users = [];
                this._filterUsers.next([]);
                this._filterPermissions.next(this.permissions);
            }
        });
        // this.dataForm = this.createDataForm();
        // this.adminUsers$ = this._service.adminUsers$;
        // this._service.getAdminUser().pipe(takeUntil(this._unsubscribeAll)).subscribe();
    }


    // toggleAll(event: MatSlideToggleChange, type: string): void{
    //     if(type === 'read'){
    //         this.permissions.map((c)=>{c.isRead = event.checked;});
    //     }
    //     else if(type === 'download')
    //     {
    //         this.permissions.map((c)=>{c.isDownload = event.checked;});
    //     }
    //     const postRequests: any = [];
    //     this.permissions.forEach((permission)=>{
    //         this.datas.forEach((item)=>{
    //             const postData = new AgendaRequestAttachmentPermissionFormModel(permission);
    //             if(this.datas.length > 0){
    //               //  postData.id = 0;
    //             }
    //             postData.id = item.id;
    //             postData.agendaRequestItemId = item.agendaRequestItemId;
    //             postData.attachmentId = item.attachmentId;
    //             postRequests.push(this._service.updatePermission(postData));
    //         });
    //     });
    //     forkJoin(postRequests).pipe(takeUntil(this._unsubscribeAll))
    //     .subscribe(()=>{});
    // }

    toggleRead(): void{
        const curentPermissions = this._filterPermissions.getValue();
        let flagData = false;
        if(this.isReadAll === false){
            this.isDownloadAll = false;
            flagData = true;
        }
        this.datas.forEach((item)=>{
            curentPermissions.forEach((element) => {
                const objItem = item.permissions.find(c=>c.userId === element.userId);
                if(objItem){
                    objItem.isRead = this.isReadAll;
                    if(flagData === true){
                        objItem.isDownload = this.isDownloadAll;
                    }
                }
            });
        });
        // curentPermissions.forEach((element) => {
        //     this.setPermission(element,null);
        // });
        this._filterPermissions.next(curentPermissions);
    }
    toggleDownload(): void{
        const curentPermissions = this._filterPermissions.getValue();
        let flagData = false;
        if(this.isDownloadAll === true){
            this.isReadAll = true;
            flagData = true;
        }
        this.datas.forEach((item)=>{
            curentPermissions.forEach((element) => {
                const objItem = item.permissions.find(c=>c.userId === element.userId);
                if(objItem){
                    if(flagData === true){
                        objItem.isRead = this.isReadAll;
                    }
                    objItem.isDownload = this.isDownloadAll;
                }
            });
        });
        // curentPermissions.forEach((element) => {
        //     this.setPermission(element,null);
        // });
        this._filterPermissions.next(curentPermissions);
    }

    getUser(): void{
        if(this.groupId){
           const filterDatas = this.users.filter(c=>c.userGroups.map(a=>a.id).includes(this.groupId));
           if(filterDatas)
           {
                this._filterUsers.next(filterDatas);
           }
           else{
                this._filterUsers.next([]);
           }
        }else{
            this._filterUsers.next(this.users);
            this._filterPermissions.next(this.permissions);
        }
        this.filterUser();
    }

    filterUser(): void{

        if(this.userId){
            const curentPermissions = this.permissions.filter(c=>c.userId === this.userId);
            this._filterPermissions.next(curentPermissions);
        }
        else if(!this.userId && this.groupId){
            const groupUsers = this.users.filter(c=>c.userGroups.map(a=>a.id).includes(this.groupId));
            const curentPermissions = this.permissions.filter(c=>groupUsers.map(a=>a.id).includes(c.userId));
            this._filterPermissions.next(curentPermissions);
        }
        else{
            this._filterPermissions.next(this.permissions);
        }
    }

    checkPermissionChange(item: AgendaRequestAttachmentPermissionModel, type: string): void {
        if (item.isDownload === true && type === 'download') {
            item.isRead = true;
        }
        if (item.isRead === false && type === 'read') {
            item.isDownload = false;
        }
        this.datas.forEach((value) => {
            const obj = value.permissions.find(c=>c.userId === item.userId);
            if(obj){
                obj.isDownload = item.isDownload;
                obj.isRead = item.isRead;
            }
        });
        // if(this.action === 'edit'){
        //     this.setPermission(item);
        // }
    }

    setPermission(value: AgendaRequestAttachmentPermissionModel, type: string): void{
        if (value.isDownload === true && type === 'download') {
            value.isRead = true;
        }
        if (value.isRead === false && type === 'read') {
            value.isDownload = false;
        }
        const postRequests: any = [];
            this.datas.forEach((item)=>{
                const postData = new AgendaRequestAttachmentPermissionFormModel(value);
                postData.id = item.id;
                postData.agendaRequestItemId = item.agendaRequestItemId;
                postData.attachmentId = item.attachmentId;
                postRequests.push(this._service.updatePermission(postData));
            });
            forkJoin(postRequests).pipe(take(1))
            .subscribe(()=>{});
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
                // const curentPermissions = this._filterPermissions.getValue();
                // const postRequests: any = [];
                // curentPermissions.forEach((value) => {
                //     this.datas.forEach((item) => {
                //         const postData = new AgendaRequestAttachmentPermissionFormModel(value);
                //         postData.id = item.id;
                //         postData.agendaRequestItemId = item.agendaRequestItemId;
                //         postData.attachmentId = item.attachmentId;

                //         postRequests.push(this._service.updatePermission(postData));
                //     });
                // });

                // forkJoin(postRequests).pipe(take(1)).subscribe(() => {
                //     Swal.fire('', 'Data has been updated').then(() => {
                //         this._matDialogRef.close();
                //     });
                //  });

                const curentPermissions = this._filterPermissions.getValue();
                const postRequests: any = [];

                curentPermissions.forEach((value) => {
                    this.datas.forEach((item) => {
                        const postData = new AgendaRequestAttachmentPermissionFormModel(value);
                        postData.id = item.id;
                        postData.agendaRequestItemId = item.agendaRequestItemId;
                        postData.attachmentId = item.attachmentId;

                        postRequests.push(postData);
                    });
                });

                this._service.updatePermissionForList(postRequests).pipe(take(1)).subscribe({
                    next: () => {
                        Swal.fire('', 'Data has been updated').then(() => {
                            this._matDialogRef.close();
                        });
                    }
                });
            }
        });
    }

    close(): void {
        if (!this.datas || this.datas.length === 0) {
            this._matDialogRef.close();
            return;
        }

        Swal.fire({
            title: '',
            text: 'Are you sure you want to continue without saving ?',
            showCancelButton: true,
            confirmButtonText: 'Ok',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                this._matDialogRef.close();
            }
        });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    ngAfterContentChecked(): void {

    }

}
