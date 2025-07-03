import { Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { AttachmentPermissionModel, MeetingAttachmentModel } from 'app/models/attachment.model';
import { InputFormData } from 'app/models/input-form-data';
import { MeetingAgendaAttachmentPermissionFormModel } from 'app/models/meeting-agenda.model';
import { StandardModel } from 'app/models/standard.model';
import { UserModel } from 'app/models/user.model';
import { BehaviorSubject, forkJoin, Observable, Subject, take, takeUntil } from 'rxjs';
import { MeetingMgmService } from '../../../meeting-mgm.service';
import { AgendaService } from '../agenda.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'meeting-agenda-attachment-permission',
    templateUrl: './permission.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AgendaAttachmentPermissionComponent implements OnInit, OnDestroy {
    @ViewChild('myForm') myForm: NgForm;
    action: string;
    datas: MeetingAttachmentModel[] = [];
    dataForm: UntypedFormGroup;
    isReadAll: boolean = false;
    isDownloadAll: boolean = false;
    permissions: AttachmentPermissionModel[] = [];
    groupId: number;
    userId: number;
    agendaId: number;
    userGroups$: Observable<StandardModel[]>;
    users$: Observable<UserModel[]>;
    users: UserModel[];
    id: number;
    private _filterPermissions: BehaviorSubject<AttachmentPermissionModel[]> = new BehaviorSubject<AttachmentPermissionModel[]>([]);
    private _unsubscribeAll: Subject<any> = new Subject();
    private _filterUsers: BehaviorSubject<UserModel[] | null> = new BehaviorSubject(null);
    constructor(
        private _matDialogRef: MatDialogRef<AgendaAttachmentPermissionComponent>,
        @Inject(MAT_DIALOG_DATA) private input: InputFormData<MeetingAttachmentModel[]>,
        private _spalsh: FuseSplashScreenService,
        private _service: AgendaService,
        private _meetingService: MeetingMgmService
    ) { }

    get filterPermissions$(): Observable<AttachmentPermissionModel[]> {
        return this._filterPermissions.asObservable();
    }
    get filterUsers$(): Observable<UserModel[]>
    {
        return this._filterUsers.asObservable();
    }

    ngOnInit(): void {
        this.action = this.input.action;
        this.datas = this.input.data;
        if (!this.datas || this.datas.length === 0) {
            this.close();
        }
        this.permissions = this.datas[0].permissions;
        this.agendaId = this.datas[0].agendaId;
        if (this.datas.length > 1) {
            this.permissions.forEach((item) => {
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
        //     this._service.getUser(null).pipe(take(1)).subscribe(() => {
        //         this._spalsh.hide();
        //     });
        //     this._service.getUserGroup().pipe(take(1)).subscribe();
        // }, 0);
        this.users$ = this._meetingService.attendeeUsers$;
        this.userGroups$ = this._meetingService.userGroups$;
        this.users$.pipe(takeUntil(this._unsubscribeAll)).subscribe((values) => {
            if (values && Array.isArray(values)) {
                this._filterUsers.next(values);
                this.users = values;
                const userIds = values.map(c => c.id);
                const curentPermissions = this.permissions.filter(c => userIds.includes(c.userId));
                this._filterPermissions.next(curentPermissions);
            }
            else {
                this.users = [];
                this._filterUsers.next([]);
                this._filterPermissions.next(this.permissions);
            }
        });

    }

    checkPermissionChange(item: AttachmentPermissionModel, type: string): void {
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

    toggleRead(): void {
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
        // if(this.action === 'edit'){
        //     curentPermissions.forEach((element) => {
        //         this.setPermission(element);
        //     });
        // }
        this._filterPermissions.next(curentPermissions);
    }

    toggleDownload(): void {
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
        // if(this.action === 'edit'){
        //     curentPermissions.forEach((element) => {
        //         this.setPermission(element);
        //     });
        // }
        this._filterPermissions.next(curentPermissions);
    }

    setPermission(value: AttachmentPermissionModel): void {
        const postRequests: any = [];
        this.datas.forEach((item) => {
            const postData = new MeetingAgendaAttachmentPermissionFormModel(value);
            postData.id = item.id;
            postData.agendaId = item.agendaId;
            postData.attachmentId = null;
            postRequests.push(this._service.attachmentPermission(postData));
        });
        forkJoin(postRequests).pipe(take(1))
            .subscribe(() => { });
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

    saveData(): void {
        Swal.fire({
            title: '',
            text: 'Do you want to save your changes ?',
            showCancelButton: true,
            confirmButtonText: 'Save',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                const curentPermissions = this._filterPermissions.getValue();

                const postRequests: any = [];
                curentPermissions.forEach((value) => {
                    this.datas.forEach((item) => {
                        const postData = new MeetingAgendaAttachmentPermissionFormModel(value);
                        postData.id = item.id;
                        postData.agendaId = item.agendaId;
                        postData.attachmentId = null;

                        postRequests.push(postData);
                    });
                });

                this._service.attachmentPermissionForList(postRequests).pipe(take(1)).subscribe({
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

}
