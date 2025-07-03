import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { AgendaRequestAttachmentFormModel, AgendaRequestAttachmentModel, AgendaRequestItemModel } from 'app/models/agenda-request.model';
import { AgendaApproveFormModel, ApproveFormModel } from 'app/models/approve-form.model';
import { InputFormData } from 'app/models/input-form-data';
import { UserModel } from 'app/models/user.model';
import { GlobalService } from 'app/services/global.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { AgendaApproveService } from '../agenda-approve.service';
import { AgendaApprovePermissionComponent } from '../view-permission/view-permission.component';
import { StandardModel } from 'app/models/standard.model';
import { AgendaReserveService } from 'app/modules/meeting/agenda-reserve/agenda-reserve.service';
import { AttachmentModel } from 'app/models/attachment.model';
import { FileInputComponent } from '@oot/file-input/file-input.component';
import { MeetingRelationModel } from 'app/models/meeting-relation.model';

@Component({
    selector: 'app-agenda-approve-detail',
    templateUrl: './detail.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AgendaApproveDetailComponent implements OnInit, OnDestroy {
    @ViewChild('attachmentInput') attachmentInput: FileInputComponent;
    data$: Observable<AgendaRequestItemModel>;
    data: AgendaRequestItemModel;
    presenters: UserModel[] = [];
    excludeUsers: UserModel[] = [];
    documentTypes$: Observable<StandardModel[]>;
    documentTypes: StandardModel[];
    attachment: AttachmentModel = null;
    documentTypeId: number = null;
    remark: string;
    token: string;
    isBookingDetail: boolean = false;
    bookingDetail: string;
    relation: MeetingRelationModel[] = [];
    relation$: Observable<MeetingRelationModel[]>;
    isRelationBookingPanel: boolean = false;
    sortAttachments: {
        fieldName: string,
        sort: 'asc' | 'desc'
    }
    sortPresenters: {
        fieldName: string,
        sort: 'asc' | 'desc'
    }
    private _unsubscribeAll: Subject<any> = new Subject();
    private _formPopup: MatDialogRef<AgendaApprovePermissionComponent>;
    constructor(
        private _service: AgendaApproveService,
        private _requestService: AgendaReserveService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _matDialog: MatDialog,
        private _globalService: GlobalService
    ) { }

    ngOnInit(): void {
        this.token = this._globalService.accessToken;
        this.data$ = this._service.data$;
        this.documentTypes$ = this._requestService.documentTypes$;
        this.data$.pipe(takeUntil(this._unsubscribeAll)).subscribe((value) => {
            this.data = value;
            console.log(this.data);
            if (value.presenters && value.presenters.length > 0) {
                this.presenters = value.presenters;
            }
            if (value.excludeUsers && value.excludeUsers.length > 0) {
                this.excludeUsers = value.excludeUsers;
            }
            if(value.bookingDetail){
                this.isBookingDetail = !!value.bookingDetail
                this.bookingDetail = value.bookingDetail
            }
        });
        this.sortAttachments = {
            fieldName: 'fileName',
            sort: 'asc'
        }
        this.sortPresenters = {
            fieldName: 'fileName',
            sort: 'asc'
        }
        this.documentTypes$.pipe(takeUntil(this._unsubscribeAll)).subscribe((value) => {
            this.documentTypes = value;
        });

        this._requestService.relation$.pipe(takeUntil(this._unsubscribeAll)).subscribe((value) => {
            this.relation = value;
        });

        if (this.relation && this.relation.length > 0){
            this.isRelationBookingPanel = true;
        }
    }
    openPermission(value: AgendaRequestAttachmentModel): void {
        const inputData: InputFormData<AgendaRequestAttachmentModel> = new InputFormData<AgendaRequestAttachmentModel>();
        inputData.data = value;
        inputData.action = 'add';
        this._formPopup = this._matDialog.open(AgendaApprovePermissionComponent, {
            panelClass: 'standard-dialog',
            data: inputData
        });
    }

    doApprove(value: boolean): void {
        if (value === false && (!this.remark || this.remark.trim() === '')) {
            Swal.fire('', 'Please provide Reason for reject.');
            return;
        }
        if (this.remark && this.remark.trim().length > 400) {
            Swal.fire('', 'Remark is allowed 400 characters.');
            return;
        }
        let alertMessage = '';
        if (value === true) {
            alertMessage = 'Do you want to approve this record?';
        } else {
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

                const postData = new AgendaApproveFormModel({});
                postData.isApprove = value;
                postData.remark = this.remark;
                postData.id = this.data.id;
                const approverAttachments = this.data.attachments.filter(c => c.isApprover === true);
                if (approverAttachments.length > 0) {
                    postData.attachments = approverAttachments.map(c => new AgendaRequestAttachmentFormModel(c));
                }
                this._service.approve(postData).pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
                    Swal.fire('', 'Data has been saved!').then(() => {
                        this._router.navigate(['../../'], { relativeTo: this._activatedRoute });
                    });
                });
            }
        });

    }


    doApproveCancel(value: boolean): void {
        if (value === false && (!this.remark || this.remark.trim() === '')) {
            Swal.fire('', 'Please provide Reason for reject.');
            return;
        }
        if (this.remark && this.remark.trim().length > 400) {
            Swal.fire('', 'Remark is allowed 400 characters.');
            return;
        }
        let alertMessage = '';
        if (value === true) {
            alertMessage = 'Do you want to approve this record?';
        } else {
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

                const postData = new AgendaApproveFormModel({});
                postData.isApprove = value;
                postData.remark = this.remark;
                postData.id = this.data.id;
                const approverAttachments = this.data.attachments.filter(c => c.isApprover === true);
                if (approverAttachments.length > 0) {
                    postData.attachments = approverAttachments.map(c => new AgendaRequestAttachmentFormModel(c));
                }
                this._service.approveCancel(postData).pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
                    Swal.fire('', 'Data has been saved!').then(() => {
                        this._router.navigate(['../../'], { relativeTo: this._activatedRoute });
                    });
                });
            }
        });

    }

    setAttachmentsSort(key: string): void {
        if (key === this.sortAttachments.fieldName) {
            this.sortAttachments.sort = this.sortAttachments.sort === 'asc' ? 'desc' : 'asc'
        } else {
            this.sortAttachments.fieldName = key
            this.sortAttachments.sort = 'asc'
        }

    }

    setPresentersSort(key: string): void {
        if (key === this.sortPresenters.fieldName) {
            this.sortPresenters.sort = this.sortPresenters.sort === 'asc' ? 'desc' : 'asc'
        } else {
            this.sortPresenters.fieldName = key
            this.sortPresenters.sort = 'asc'
        }

    }

    sortArrayByField(array: AgendaRequestAttachmentModel[] | AgendaRequestAttachmentModel[], fieldName: string, sort: string): AgendaRequestAttachmentModel[] {

        return array.sort((a, b) => {
            // Handle undefined or null fields gracefully
            const fieldA = a[fieldName] ?? '';
            const fieldB = b[fieldName] ?? '';

            // Determine comparison based on order
            if (sort === 'asc') {
                return fieldA > fieldB ? 1 : fieldA < fieldB ? -1 : 0;
            } else {
                return fieldA < fieldB ? 1 : fieldA > fieldB ? -1 : 0;
            }
        });
    }


    doApproveEdit(value: boolean): void {
        if (value === false && (!this.remark || this.remark.trim() === '')) {
            Swal.fire('', 'Please provide Reason for reject.');
            return;
        }
        if (this.remark && this.remark.trim().length > 400) {
            Swal.fire('', 'Remark is allowed 400 characters.');
            return;
        }
        let alertMessage = '';
        if (value === true) {
            alertMessage = 'Do you want to approve this record?';
        } else {
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

                const postData = new AgendaApproveFormModel({});
                postData.isApprove = value;
                postData.remark = this.remark;
                postData.id = this.data.id;
                const approverAttachments = this.data.attachments.filter(c => c.isApprover === true);
                if (approverAttachments.length > 0) {
                    postData.attachments = approverAttachments.map(c => new AgendaRequestAttachmentFormModel(c));
                }
                this._service.approveEdit(postData).pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
                    Swal.fire('', 'Data has been saved!').then(() => {
                        this._router.navigate(['../../'], { relativeTo: this._activatedRoute });
                    });
                });
            }
        });

    }

    addAttachment(id: number): void {
        if (!this.attachment || !this.documentTypeId) {
            Swal.fire('', 'Please select file upload and Document Type.');
            return;
        }
        const checkExist = this.data.attachments.find(c => c.fileName === this.attachment.fileName && c.documentTypeId === this.documentTypeId);
        if (checkExist) {
            Swal.fire('', 'This file already exists.');
            return;
        }
        let obj = new AgendaRequestAttachmentModel(this.attachment);
        obj.isApprover = true;
        // select max pos of this.data.attachments
        const maxPos = Math.max.apply(Math, this.data.attachments.map(function (o) { return o.pos; }));
        obj.pos = maxPos + 1;
        obj.attachmentType = 'attachment';
        obj.documentTypeId = this.documentTypeId;
        obj.documentTypeName = this.documentTypes.find(c => c.id === this.documentTypeId).name;
        this.data.attachments.push(obj);
        this.attachment = null;
        this.documentTypeId = null;
    }
    deleteAttachment(id: number): void {
        Swal.fire({
            title: '',
            text: 'Do you want to delete this item?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                const index = this.data.attachments.findIndex(c => c.id === id);
                if (index > -1) {
                    this.data.attachments.splice(index, 1);
                }
            }
        });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}
