import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AgendaRequestUpdateFormModel } from 'app/models/agenda-request-form.model';
import {
    AgendaRequestAttachmentModel,
    AgendaRequestAttachmentPermissionModel,
    AgendaRequestItemModel,
} from 'app/models/agenda-request.model';
import { MeetingAttendeeModel } from 'app/models/attendee.model';
import { InputFormData } from 'app/models/input-form-data';
import { StandardModel } from 'app/models/standard.model';
import { UserListModel, UserModel } from 'app/models/user.model';
import { CustomValidator } from 'app/validators/custom.validate';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { AgendaReserveService } from '../agenda-reserve.service';
import { RequestInfoDocumentPermissionComponent } from './document-permission/permission.component';
import { RequestInfoPermissionComponent } from './view-permission/view-permission.component';
import { ApproveFormModel } from 'app/models/approve-form.model';
import { MeetingRelationModel } from 'app/models/meeting-relation.model'
@Component({
    selector: 'app-request-info',
    templateUrl: './request-info.component.html',
    encapsulation: ViewEncapsulation.None
})
export class RequestInfoComponent implements OnInit, OnDestroy {

    @Input() data$: Observable<AgendaRequestItemModel>;
    data: AgendaRequestItemModel;
    dataForm: UntypedFormGroup;
    users: UserModel[] = [];
    sortAttachments: {
        fieldName: string,
        sort: 'asc' | 'desc'
    }
    sortPresenters: {
        fieldName: string,
        sort: 'asc' | 'desc'
    }
    allUsers: UserModel[] = [];
    presenters: UserModel[] = [];
    excludeUsers: UserModel[] = [];
    selectPresenters: UserModel[] = [];
    selectExcludeUsers: UserModel[] = [];
    selectPresenter: number = null;
    selectExcludeUser: number = null;
    presenterAttachments: AgendaRequestAttachmentModel[] = [];
    presenterAttachment: AgendaRequestAttachmentModel;
    relation: MeetingRelationModel[] = [];

    attachments: AgendaRequestAttachmentModel[] = [];
    attachment: AgendaRequestAttachmentModel;
    documentTypes$: Observable<StandardModel[]>;
    documentType: StandardModel;
    isAllCheck: boolean = false;

    isPresenterPanel: boolean = false;
    isExcludeUserPanel: boolean = false;
    isPresenterDocumentPanel: boolean = false;
    isAttachmentPanel: boolean = false;
    isReferenceAttachmentPanel: boolean = true;
    isRelationBookingPanel: boolean = false;
    isBookingDetail: boolean = false;
    bookingDetail: string;
    attendees: MeetingAttendeeModel[] = [];
    confidentials$: Observable<StandardModel[]>;
    objectives$: Observable<StandardModel[]>;
    relation$: Observable<MeetingRelationModel[]>;
    private _formPopup: MatDialogRef<RequestInfoDocumentPermissionComponent>;
    private _viewPermissionPopup: MatDialogRef<RequestInfoPermissionComponent>;
    private _optionPresenters: BehaviorSubject<UserModel[] | null> = new BehaviorSubject([]);
    private _optionExcludeUsers: BehaviorSubject<UserModel[] | null> = new BehaviorSubject([]);
    private _unsubscribeAll: Subject<any> = new Subject();


    constructor(
        private _matDialog: MatDialog,
        private _formBuilder: UntypedFormBuilder,
        private _service: AgendaReserveService,
        private _route: ActivatedRoute
    ) { }

    get optionPresenters$(): Observable<UserListModel[]> {
        return this._optionPresenters.asObservable();
    }
    get optionExcludeUsers$(): Observable<UserListModel[]> {
        return this._optionExcludeUsers.asObservable();
    }

    ngOnInit(): void {
        this.sortAttachments = {
            fieldName: 'fileName',
            sort: 'asc'
        }
        this.sortPresenters = {
            fieldName: 'fileName',
            sort: 'asc'
        }

        this._service.users$.pipe(takeUntil(this._unsubscribeAll)).subscribe((value) => {
            this.users = value;
        });
        this.confidentials$ = this._service.confidentials$;
        this.objectives$ = this._service.objectives$;

        this.data$.pipe(takeUntil(this._unsubscribeAll)).subscribe((value: AgendaRequestItemModel) => {
            this.data = value;
            if (value.presenters && value.presenters.length > 0) {
                this.presenters = value.presenters;
            }
            if (value.excludeUsers && value.excludeUsers.length > 0) {
                this.excludeUsers = value.excludeUsers;
            }
            if (value.presenterAttachments && value.presenterAttachments.length > 0) {
                this.presenterAttachments = value.presenterAttachments;
            }
            if (value.attachments && value.attachments.length > 0) {
                this.attachments = value.attachments;
            }
            if(value.bookingDetail){
                this.isBookingDetail = !!value.bookingDetail
                this.bookingDetail = value.bookingDetail
            }
        });

        this._service.relation$.pipe(takeUntil(this._unsubscribeAll)).subscribe((value) => {
            this.relation = value;
        });

        this.dataForm = this.createDataForm();
        if (this.data) {
            if (!(this.data.isOwner || this.data.isAgendaWorkingTeam)) {
                this.dataForm.get('title').disable();
                this.dataForm.get('useTime').disable();
                this.dataForm.get('excludeUsers').disable();
                this.dataForm.get('presenters').disable();
                this.dataForm.get('isVote').disable();
                this.dataForm.get('isVoteOpen').disable();
                this.dataForm.get('description').disable();
            }
        }

        if (this.data.presenters && this.data.presenters.length > 0) {
            this.selectPresenters = this.data.presenters;
        } else {
            this.selectPresenters = [];
        }
        if (this.data.excludeUsers && this.data.excludeUsers.length > 0) {
            this.selectExcludeUsers = this.data.excludeUsers;
        } else {
            this.selectExcludeUsers = [];
        }

        //********* */
        if (this.selectPresenters && this.selectPresenters.length > 0) {
            this.isPresenterPanel = true;
        }
        if (this.selectExcludeUsers && this.selectExcludeUsers.length > 0) {
            this.isExcludeUserPanel = true;
        }
        if (this.presenterAttachments && this.presenterAttachments.length > 0) {
            this.isPresenterDocumentPanel = true;
        }
        if (this.attachments && this.attachments.length > 0) {
            this.isAttachmentPanel = true;
        }
        if (this.relation && this.relation.length > 0){
            this.isRelationBookingPanel = true;
        }
        this.reloadOptionSelect();
        this.documentTypes$ = this._service.documentTypes$;

        this._service.attendees$.pipe(takeUntil(this._unsubscribeAll)).subscribe((value) => {
            if (value) {
                this.attendees = value;
                this.processPermission();
            }
        });

        this.dataForm.get('isVoteOpen').valueChanges.pipe(takeUntil(this._unsubscribeAll)).subscribe((value) => {
            if (value === true) {
                this.dataForm.get('isVote').patchValue(true);
                this.dataForm.get('isVote').updateValueAndValidity();
            }
        });
        this.dataForm.get('isVote').valueChanges.pipe(takeUntil(this._unsubscribeAll)).subscribe((value) => {
            if (value === false) {
                this.dataForm.get('isVoteOpen').patchValue(false);
                this.dataForm.get('isVoteOpen').updateValueAndValidity();
            }
        });
        this.formEvent();
    }

    formEvent(): void {
        this.dataForm.get('agendaObjectiveId').valueChanges.pipe(takeUntil(this._unsubscribeAll)).subscribe((value) => {
            if (this.dataForm.get('agendaObjectiveId').value !== this.data.agendaObjectiveId) {
                this.data.isReviewed = false;
                this.data.isEdit = true;
                this.data.isReview = true;
            }
        });
    }


    createDataForm(): UntypedFormGroup {
        return this._formBuilder.group({
            'id': [(this.data.id ? this.data.id : 0)],
            'meetingId': [this.data.meetingId],
            'agendaObjectiveId': [this.data.agendaObjectiveId],
            'agendaConfidentialId': [this.data.agendaConfidentialId],
            'isVote': [{ value: this.data.isVote, disabled: (!(this.data.isOwner || this.data.isAgendaWorkingTeam) || !this.data.isEdit) }],
            'isVoteOpen': [{ value: this.data.isVoteOpen, disabled: (!(this.data.isOwner || this.data.isAgendaWorkingTeam) || !this.data.isEdit) }],
            'isConfirm': [{ value: this.data.isConfirm, disabled: (!(this.data.isOwner || this.data.isAgendaWorkingTeam) || !this.data.isEdit) }],
            'title': [{ value: this.data.title, disabled: (!(this.data.isOwner || this.data.isAgendaWorkingTeam) || !this.data.isEdit) }, [Validators.required, Validators.maxLength(900), CustomValidator.whiteSpace]],
            'description': [{ value: this.data.description, disabled: (!(this.data.isOwner || this.data.isAgendaWorkingTeam) || !this.data.isEdit) }, [Validators.maxLength(2000), CustomValidator.whiteSpace]],
            'useTime': [{ value: this.data.useTime !== 0 ? this.data.useTime : null, disabled: (!(this.data.isOwner || this.data.isAgendaWorkingTeam) || !this.data.isEdit) }],
            'excludeUsers': [(this.data.excludeUsers ? this.data.excludeUsers.map(c => c.id) : [])],
            'presenters': [this.data.presenters ? this.data.presenters.map(c => c.id) : []],
            'bookingDetail': [{ value: this.data.bookingDetail, disabled: (!(this.data.isOwner || this.data.isAgendaWorkingTeam) || !this.data.isEdit) }],
        });
    }

    reloadOptionSelect(): void {
        this._optionPresenters.next(this.users.filter(c => !this.selectPresenters.find(a => a.id === c.id) && !this.selectExcludeUsers.find(a => a.id === c.id)));
        this._optionExcludeUsers.next(this.data.attendees.filter(c => !this.selectPresenters.find(a => a.id === c.id) && !this.selectExcludeUsers.find(a => a.id === c.id)));
    }


    // Presenter Process
    addPresenter(): void {
        this.selectExcludeUser = null;
        if (!this.selectPresenter) { return; }
        const selectData = this.selectPresenters.find(c => c.id === this.selectPresenter);
        if (selectData) { return; }
        const addData = this.users.find(c => c.id === this.selectPresenter);
        if (addData) {
            this.selectPresenters.push(addData);
        }
        this.reloadOptionSelect();
        this.selectPresenter = null;
    }



    removePresenter(item: UserListModel): void {
        Swal.fire({
            title: '',
            text: 'Do you want to delete this item?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
        }).then((result) => {
            if (result.isConfirmed) {
                this.selectExcludeUser = null;
                this.selectPresenters = this.selectPresenters.filter(c => c.id !== item.id);
                this.reloadOptionSelect();
            }
        });

    }

    //Exclude User Process
    addExcludeUser(): void {
        this.selectPresenter = null;
        if (!this.selectExcludeUser) { return; }
        const selectData = this.selectExcludeUsers.find(c => c.id === this.selectExcludeUser);
        if (selectData) { return; }
        const addData = this.data.attendees.find(c => c.id === this.selectExcludeUser);
        if (addData) {
            this.selectExcludeUsers.push(addData);
        }
        this.reloadOptionSelect();
        this.selectExcludeUser = null;
    }
    removeExcludeUser(item: UserListModel): void {
        Swal.fire({
            title: '',
            text: 'Do you want to delete this item?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
        }).then((result) => {
            if (result.isConfirmed) {
                this.selectPresenter = null;
                this.selectExcludeUsers = this.selectExcludeUsers.filter(c => c.id !== item.id);
                this.reloadOptionSelect();
            }
        });
    }

    // PresenterAttachment Process

    addPresenterAttachment(): void {
        if (!this.presenterAttachment) { return; }
        const checkExist = this.presenterAttachments.find(c => c.fileName === this.presenterAttachment.fileName);
        if (checkExist) {
            Swal.fire('', 'This file already exists.');
            return;
        }

        const addData = new AgendaRequestAttachmentModel(this.presenterAttachment);
        addData.isNew = true;
        addData.attachmentId = addData.id;
        this.presenterAttachments.push(addData);
        this.presenterAttachment = null;
    }
    removePresenterAttachment(item: AgendaRequestAttachmentModel): void {
        if (!item) { return; }
        Swal.fire({
            title: '',
            text: 'Do you want to delete this item?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
        }).then((result) => {
            if (result.isConfirmed) {
                this.presenterAttachments = this.presenterAttachments.filter(c => c !== item);
            }
        });
    }

    //Attachment Process
    addAttachment(): void {
        if (!this.attachment) { return; }
        const checkExist = this.attachments.find(c => c.fileName === this.attachment.fileName && c.documentTypeId === this.documentType.id);
        if (checkExist) {
            Swal.fire('', 'This file already exists.');
            return;
        }
        const addData = new AgendaRequestAttachmentModel(this.attachment);
        addData.attachmentId = addData.id;
        addData.isNew = true;
        if (this.documentType) {
            addData.documentTypeId = this.documentType.id;
            addData.documentTypeName = this.documentType.name;
        }

        addData.pos = this.attachments.length + 1;
        this.processItemPermission(addData);
        this.attachments.push(addData);
        this.attachment = null;
        this.documentType = null;
        this.sortAttachment();

    }
    removeAttachment(item: AgendaRequestAttachmentModel): void {
        if (!item) { return; }
        Swal.fire({
            title: '',
            text: 'Do you want to delete this item?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
        }).then((result) => {
            if (result.isConfirmed) {
                this.attachments = this.attachments.filter(c => c !== item);
                this.sortAttachment();
            }
        });
    }

    sortAttachment(): void {
        this.attachments = this.attachments.sort((first, second) => 0 - (first.pos > second.pos ? -1 : 1));
        this.attachments.forEach((item, index) => {
            item.pos = index + 1;
        });

    }
    processPermission(): void {
        this.attachments.forEach((item) => {
            this.processItemPermission(item);
        });
    }
    processItemPermission(value: AgendaRequestAttachmentModel): void {
        let notAssignPermissions = this.attendees;
        if (value.permissions.length > 0) {
            notAssignPermissions = this.attendees.filter(c => value.permissions.find(a => a.userId !== c.id));
        }
        else {
            notAssignPermissions.forEach((item) => {
                const obj = new AgendaRequestAttachmentPermissionModel({});
                obj.id = 0;
                obj.attachmentId = value.id;
                obj.userId = item.id;
                obj.isRead = true;
                obj.isDownload = true;
                obj.name = item.name;
                value.permissions.push(obj);
            });
        }
    }

    toggleAllAttachment(event: MatCheckboxChange): void {
        if (event.checked) {
            this.attachments.forEach((item) => { item.isCheck = true; });
        } else {
            this.attachments.forEach((item) => { item.isCheck = false; });
        }
    }


    // openPermission(): void {
    //     const inputData: InputFormData<AgendaRequestAttachmentModel[]> = new InputFormData<AgendaRequestAttachmentModel[]>();
    //     const selectDatas = this.attachments.filter(c => c.isCheck === true);
    //     if (!selectDatas) { return; }
    //     inputData.data = selectDatas;
    //     inputData.action = 'add';
    //     this._formPopup = this._matDialog.open(RequestInfoDocumentPermissionComponent, {
    //         panelClass: 'standard-dialog',
    //         width: '80%',
    //         height: '99%',
    //         data: inputData
    //     });
    //     this._formPopup.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe((values: AgendaRequestAttachmentModel[]) => {
    //         this.isAllCheck = false;
    //         selectDatas.forEach((element) => {
    //             element.isCheck = false;
    //         });
    //     });
    // }

    openPermission(value: AgendaRequestAttachmentModel): void {
        const inputData: InputFormData<AgendaRequestAttachmentModel> = new InputFormData<AgendaRequestAttachmentModel>();
        inputData.data = value;
        inputData.action = 'add';
        this._viewPermissionPopup = this._matDialog.open(RequestInfoPermissionComponent, {
            panelClass: 'standard-dialog',
            data: inputData
        });
    }

    // singlePermission(item: AgendaRequestAttachmentModel): void {
    //     this.attachments.forEach((element) => {
    //         element.isCheck = false;
    //     });
    //     item.isCheck = true;
    //     this.openPermission();
    // }

    move(previousIndex: number, currentIndex: number): void {
        if (currentIndex >= 0 && currentIndex < this.attachments.length) {
            moveItemInArray(this.attachments, previousIndex, currentIndex);
        }
        this.updateAttachmentPosition();
    }
    drop(event: any): void {
        moveItemInArray(this.attachments, event.previousIndex, event.currentIndex);
        this.updateAttachmentPosition();
    }

    updateAttachmentPosition(): void {
        this.attachments.forEach((item, index) => {
            item.pos = index + 1;
        });
    }

    // form update

    update(): void {
        if (this.dataForm.valid) {

            Swal.fire({
                title: '',
                text: 'Do you want to save your changes ?',
                showCancelButton: true,
                confirmButtonText: 'Save',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    const postData = new AgendaRequestUpdateFormModel(this.dataForm.getRawValue());
                    if (postData.useTime == null) {
                        postData.useTime = 0;
                    }
                    if (this.selectExcludeUsers && this.selectExcludeUsers.length > 0) {
                        postData.excludeUsers = this.selectExcludeUsers.map(c => c.id);
                    }
                    else {
                        postData.excludeUsers = [];
                    }

                    if (this.selectPresenters && this.selectPresenters.length > 0) {
                        postData.presenters = this.selectPresenters.map(c => c.id);
                    } else {
                        postData.presenters = [];
                    }

                    if (this.attachments && this.attachments.length > 0) {
                        postData.attachments = this.attachments;
                    } else {
                        postData.attachments = [];
                    }

                    if (this.presenterAttachments && this.presenterAttachments.length > 0) {
                        postData.presenterAttachments = this.presenterAttachments;
                    } else {
                        postData.presenterAttachments = [];
                    }

                    this._service.update(postData).pipe(take(1)).subscribe(() => {
                        Swal.fire('', 'Data has been saved.');
                        this._service.getData(this._route.snapshot.paramMap.get('id')).pipe(take(1)).subscribe(() => { });
                    });
                }
            });
        }
    }

    submit(): void {
        if (this.dataForm.valid) {

            Swal.fire({
                title: '',
                text: 'Do you want to submit this record?',
                showCancelButton: true,
                confirmButtonText: 'Submit',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    const postData = new AgendaRequestUpdateFormModel(this.dataForm.getRawValue());
                    if (postData.useTime == null) {
                        postData.useTime = 0;
                    }
                    if (this.selectExcludeUsers && this.selectExcludeUsers.length > 0) {
                        postData.excludeUsers = this.selectExcludeUsers.map(c => c.id);
                    }
                    else {
                        postData.excludeUsers = [];
                    }

                    if (this.selectPresenters && this.selectPresenters.length > 0) {
                        postData.presenters = this.selectPresenters.map(c => c.id);
                    } else {
                        postData.presenters = [];
                    }

                    if (this.attachments && this.attachments.length > 0) {
                        postData.attachments = this.attachments;
                    } else {
                        postData.attachments = [];
                    }

                    if (this.presenterAttachments && this.presenterAttachments.length > 0) {
                        postData.presenterAttachments = this.presenterAttachments;
                    } else {
                        postData.presenterAttachments = [];
                    }

                    this._service.submit(postData).pipe(take(1)).subscribe(() => {
                        Swal.fire('', 'Data has been saved.');
                        this._service.getData(this._route.snapshot.paramMap.get('id')).pipe(take(1)).subscribe(() => { });
                    });
                }
            });
        }
    }

    documentSubmit(): void {
        if (this.dataForm.valid) {

            Swal.fire({
                title: '',
                text: 'Do you want to submit this record?',
                showCancelButton: true,
                confirmButtonText: 'Submit',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    const postData = new AgendaRequestUpdateFormModel(this.dataForm.getRawValue());
                    if (postData.useTime == null) {
                        postData.useTime = 0;
                    }
                    if (this.selectExcludeUsers && this.selectExcludeUsers.length > 0) {
                        postData.excludeUsers = this.selectExcludeUsers.map(c => c.id);
                    }
                    else {
                        postData.excludeUsers = [];
                    }

                    if (this.selectPresenters && this.selectPresenters.length > 0) {
                        postData.presenters = this.selectPresenters.map(c => c.id);
                    } else {
                        postData.presenters = [];
                    }

                    if (this.attachments && this.attachments.length > 0) {
                        postData.attachments = this.attachments;
                    } else {
                        postData.attachments = [];
                    }

                    if (this.presenterAttachments && this.presenterAttachments.length > 0) {
                        postData.presenterAttachments = this.presenterAttachments;
                    } else {
                        postData.presenterAttachments = [];
                    }

                    this._service.docSubmit(postData).pipe(take(1)).subscribe(() => {
                        Swal.fire('', 'Data has been saved.');
                        this._service.getData(this._route.snapshot.paramMap.get('id')).pipe(take(1)).subscribe(() => { });
                    });
                }
            });
        }
    }

    reSubmit(): void {
        if (this.dataForm.valid) {

            Swal.fire({
                title: '',
                text: 'Do you want to submit this record?',
                showCancelButton: true,
                confirmButtonText: 'Submit',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    const postData = new AgendaRequestUpdateFormModel(this.dataForm.getRawValue());
                    if (postData.useTime == null) {
                        postData.useTime = 0;
                    }
                    if (this.selectExcludeUsers && this.selectExcludeUsers.length > 0) {
                        postData.excludeUsers = this.selectExcludeUsers.map(c => c.id);
                    }
                    else {
                        postData.excludeUsers = [];
                    }

                    if (this.selectPresenters && this.selectPresenters.length > 0) {
                        postData.presenters = this.selectPresenters.map(c => c.id);
                    } else {
                        postData.presenters = [];
                    }

                    if (this.attachments && this.attachments.length > 0) {
                        postData.attachments = this.attachments;
                    } else {
                        postData.attachments = [];
                    }

                    if (this.presenterAttachments && this.presenterAttachments.length > 0) {
                        postData.presenterAttachments = this.presenterAttachments;
                    } else {
                        postData.presenterAttachments = [];
                    }

                    this._service.reSubmit(postData).pipe(take(1)).subscribe(() => {
                        Swal.fire('', 'Data has been saved.');
                        this._service.getData(this._route.snapshot.paramMap.get('id')).pipe(take(1)).subscribe(() => { });
                    });
                }
            });
        }
    }

    requestCancel(): void {
        Swal.fire({
            title: null,
            input: 'textarea',
            inputAttributes: {
                autocapitalize: 'off'
            },
            text: 'Please put reason for request cancel!',
            showCancelButton: true,
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            preConfirm: (remark) => {
                if (!remark || String(remark).trim() === '') {
                    Swal.showValidationMessage('Please put reason for request cancel!');
                    return false;
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                var postData = new ApproveFormModel({});
                postData.id = this.data.id;
                postData.remark = result.value;
                this._service.requestCancel(postData).pipe(take(1)).subscribe(() => {
                    Swal.fire('', 'Data has been submited.');
                    this._service.getData(this.data.id.toString()).pipe(take(1)).subscribe(() => { });
                });
            }
        });
    }

    requestEdit(): void {
        Swal.fire({
            title: null,
            input: 'textarea',
            inputAttributes: {
                autocapitalize: 'off'
            },
            text: 'Please put reason for request edit!',
            showCancelButton: true,
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            preConfirm: (remark) => {
                if (!remark || String(remark).trim() === '') {
                    Swal.showValidationMessage('Please put reason for request edit!');
                    return false;
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                var postData = new ApproveFormModel({});
                postData.id = this.data.id;
                postData.remark = result.value;
                this._service.requestEdit(postData).pipe(take(1)).subscribe(() => {
                    Swal.fire('', 'Data has been submited.');
                    this._service.getData(this.data.id.toString()).pipe(take(1)).subscribe(() => { });
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
        const list  = [...array]
        return list.sort((a, b) => {
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

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
