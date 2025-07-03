import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { ApproveFormModel, MinuteApproveFormModel } from 'app/models/approve-form.model';
import { AttachmentModel, MeetingAttachmentModel } from 'app/models/attachment.model';
import { InputFormData } from 'app/models/input-form-data';
import { MinuteAttachmentFormModel, MinuteRequestModel } from 'app/models/minute-request.model';
import { UserModel } from 'app/models/user.model';
import { GlobalService } from 'app/services/global.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { MinuteApproveService } from '../minute-approve.service';
import { MinuteApprovePermissionComponent } from '../view-permission/view-permission.component';

@Component({
    selector: 'app-minute-approve-detail',
    templateUrl: './detail.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class MinuteApproveDetailComponent implements OnInit, OnDestroy {
    data$: Observable<MinuteRequestModel>;
    data: MinuteRequestModel;
    presenters: UserModel[] = [];
    excludeUsers: UserModel[] = [];
    attachment: AttachmentModel = null;
    remark: string;
    token: string;
    private _unsubscribeAll: Subject<any> = new Subject();
    private _formPopup: MatDialogRef<MinuteApprovePermissionComponent>;
    constructor(
        private _service: MinuteApproveService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _matDialog: MatDialog,
        private _globalService: GlobalService
    ) { }

    ngOnInit(): void {
        this.token = this._globalService.accessToken;
        this.data$ = this._service.data$;
        this.data$.pipe(takeUntil(this._unsubscribeAll)).subscribe((value) => {
            this.data = value;
            if (value.agenda.presenters && value.agenda.presenters.length > 0) {
                this.presenters = value.agenda.presenters.map((c)=>{
                    const obj = new UserModel({});
                    obj.id = c.id;
                    obj.name = c.name;
                    return obj;
                });
            }
            if (value.agenda.excludeUsers && value.agenda.excludeUsers.length > 0) {
                this.excludeUsers = value.agenda.excludeUsers.map((c)=>{
                    const obj = new UserModel({});
                    obj.id = c.id;
                    obj.name = c.name;
                    return obj;
                });
            }
        });
    }
    openPermission(value: MeetingAttachmentModel): void {
        const inputData: InputFormData<MeetingAttachmentModel> = new InputFormData<MeetingAttachmentModel>();
        inputData.data = value;
        inputData.action = 'add';
        this._formPopup = this._matDialog.open(MinuteApprovePermissionComponent, {
            panelClass: 'standard-dialog',
            data: inputData
        });
    }

    doApprove(value: boolean): void {
        if (value === false && (!this.remark || this.remark.trim() === '')) {
            Swal.fire('', 'Please provide Reason for reject.');
            return;
        }
        if(this.remark && this.remark.trim().length > 400){
            Swal.fire('', 'Remark is allowed 400 characters.');
            return;
        }
        let alertMessage = '';
        if(value === true){
            alertMessage = 'Do you want to approve this record?';
        }else{
            alertMessage = 'Do you want to reject this record?';
        }
        Swal.fire({
            title: '',
            text: alertMessage,
            showCancelButton: true,
            confirmButtonText: 'Submit',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {

                const postData = new MinuteApproveFormModel({});
                postData.isApprove = value;
                postData.remark = this.remark;
                postData.id = this.data.minuteRequest.id;
                if(this.attachment && this.attachment.id){
                    const attachmentObj = new MinuteAttachmentFormModel(this.attachment);
                    postData.attachments.push(attachmentObj);
                }
                this._service.approve(postData).pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
                    Swal.fire('', 'Data has been saved!').then(() => {
                        this._router.navigate(['../../'], { relativeTo: this._activatedRoute });
                    });
                });
            }
        });

    }
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}
