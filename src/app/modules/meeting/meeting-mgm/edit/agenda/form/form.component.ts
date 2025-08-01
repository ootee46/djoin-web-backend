import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
    AfterContentChecked,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatDrawer } from '@angular/material/sidenav';
import { fuseAnimations } from '@fuse/animations';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { FileInputComponent } from '@oot/file-input/file-input.component';
import { AgendaRefAttachmentModel } from 'app/models/agenda-ref-attachment.model';
import {
    AttachmentFormModel,
    AttachmentModel,
    AttachmentPermissionModel,
    MeetingAttachmentModel,
} from 'app/models/attachment.model';
import { MeetingAttendeeModel } from 'app/models/attendee.model';
import { InputFormData } from 'app/models/input-form-data';
import { MeetingAgendaAttachmentFormModel, MeetingAgendaFormModel, MeetingAgendaModel } from 'app/models/meeting-agenda.model';
import { MeetingListModel, MeetingModel } from 'app/models/meeting.model';
import { QueryListModel } from 'app/models/query-list.model';
import { StandardModel } from 'app/models/standard.model';
import { UserListModel, UserModel } from 'app/models/user.model';
import { MeetingSearchComponent } from 'app/modules/shares/meeting-search/meeting-search.component';
import { CustomValidator } from 'app/validators/custom.validate';
import { BehaviorSubject, concatMap, Observable, of, Subject, take, takeLast, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { MeetingMgmService } from '../../../meeting-mgm.service';
import { AgendaService } from '../agenda.service';
import { FileHistoryComponent } from '../file-history/file-history.component';
import { AgendaAttachmentPermissionComponent } from '../permission/permission.component';
import { ReplaceAttachmentFormComponent } from '../replace-attachment/replace-attachment.component';

@Component({
    selector: 'meeting-agenda-form',
    templateUrl: './form.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class MeetingAgendaFormComponent implements OnInit, OnDestroy, AfterContentChecked {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    @ViewChild('myForm') myForm: NgForm;
    @ViewChild('agendaNoArea') agendaNoArea: MatFormField;
    @ViewChild('attachmentInput') attachmentInput: FileInputComponent;
    @ViewChild('presenterAttachmentInput') presenterAttachmentInput: FileInputComponent;
    action: string;
    dialogTitle: string;
    data: MeetingAgendaModel;
    dataForm: UntypedFormGroup;
    kw: string;
    sortAttachments: {
        fieldName: string,
        sort: 'asc' | 'desc' | 'none'
    }
    sortPresenters: {
        fieldName: string,
        sort: 'asc' | 'desc'
    }
    roomColor: string;
    users: UserListModel[] = [];
    allUsers: UserListModel[] = [];
    selectPresenters: UserListModel[] = [];
    selectExcludeUsers: UserListModel[] = [];
    selectPresenter: number = null;
    selectExcludeUser: number = null;
    presenterAttachments: MeetingAttachmentModel[] = [];
    presenterAttachment: AttachmentModel;
    attachments: MeetingAttachmentModel[] = [];
    attachmentsRememberSort: MeetingAttachmentModel[] = [];
    attachment: AttachmentModel;
    documentTypes$: Observable<StandardModel[]>;
    documentType: StandardModel;
    isAllCheck: boolean = false;
    meeting: MeetingModel = null;
    attendees: MeetingAttendeeModel[] = [];
    isPresenterPanel: boolean = false;
    isExcludeUserPanel: boolean = false;
    isPresenterDocumentPanel: boolean = false;
    isAttachmentPanel: boolean = false;
    isReferenceAttachmentPanel: boolean = true;
    refAttachments: AgendaRefAttachmentModel[] = [];
    agendaRefAttachment: AgendaRefAttachmentModel;
    agendas$: Observable<MeetingAgendaModel[]>;
    agendaRefAttachment$: Observable<AgendaRefAttachmentModel>;
    selectedAgendaId: number;
    bgSteps = ['bg-white', 'bg-white', 'bg-white', 'bg-white', 'bg-white', 'bg-white', 'bg-white', 'bg-white', 'bg-white', 'bg-white'];
    private _selectedMeeting: BehaviorSubject<MeetingListModel | null> = new BehaviorSubject<MeetingListModel>(null);
    private _meetingSearchForm: MatDialogRef<MeetingSearchComponent>;
    private _optionPresenters: BehaviorSubject<UserListModel[] | null> = new BehaviorSubject([]);
    private _optionExcludeUsers: BehaviorSubject<UserListModel[] | null> = new BehaviorSubject([]);
    private _unsubscribeAll: Subject<any> = new Subject();
    private _formPopup: MatDialogRef<AgendaAttachmentPermissionComponent>;
    private _replaceFilePopup: MatDialogRef<ReplaceAttachmentFormComponent>;
    private _fileHistoryPopup: MatDialogRef<FileHistoryComponent>;

    constructor(
        private _matDialogRef: MatDialogRef<MeetingAgendaFormComponent>,
        @Inject(MAT_DIALOG_DATA) private input: InputFormData<MeetingAgendaModel>,
        private _formBuilder: UntypedFormBuilder,
        private _service: AgendaService,
        private _meetingService: MeetingMgmService,
        private _matDialog: MatDialog,
        private _splash: FuseSplashScreenService,
        private _changeDetectorRef: ChangeDetectorRef,
    ) { }

    get selectedMeeting$(): Observable<MeetingListModel> {
        return this._selectedMeeting.asObservable();
    }
    get optionPresenters$(): Observable<UserListModel[]> {
        return this._optionPresenters.asObservable();
    }
    get optionExcludeUsers$(): Observable<UserListModel[]> {
        return this._optionExcludeUsers.asObservable();
    }

    ngOnInit(): void {
        this.sortAttachments = {
            fieldName: 'fileName',
            sort: 'none'
        }
        this.sortPresenters = {
            fieldName: 'fileName',
            sort: 'asc'
        }

        this.kw = null;
        this.action = this.input.action;
        this.dialogTitle = (this.action === 'add' ? 'New' : 'Update');
        this.data = this.input.data;
        this.dataForm = this.createDataForm();
        this._meetingService.users$.pipe(takeUntil(this._unsubscribeAll)).subscribe((values)=>{
            this.allUsers = values;
        });
        this._meetingService.attendees$.pipe(takeUntil(this._unsubscribeAll)).subscribe((values) => {
            if (values && values.length > 0) {
                this.users = values.map((c) => {
                    const obj = new UserModel({});
                    obj.id = c.userId;
                    obj.userName = c.userName;
                    obj.name = c.name;
                    obj.firstName = c.firstName;
                    obj.lastName = c.lastName;
                    obj.email = c.email;
                    return obj;
                });
            } else {
                this.users = [];
            }
        });

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
        if (this.data.attachments && this.data.attachments.length > 0) {
            this.attachments = this.data.attachments;
            this.attachmentsRememberSort = this.data.attachments;
        }
        if (this.data.presenterAttachments && this.data.presenterAttachments.length > 0) {
            this.presenterAttachments = this.data.presenterAttachments;
        }
        this.reloadOptionSelect();
        this.documentTypes$ = this._meetingService.documentTypes$;
        this._meetingService.data$.pipe(takeUntil(this._unsubscribeAll)).subscribe((value) => {
            this.meeting = value;
        });
        this._meetingService.attendees$.pipe(takeUntil(this._unsubscribeAll)).subscribe((value) => {
            this.attendees = value;
            this.processPermission();
        });
        this.dataForm.get('isCustom').valueChanges.pipe(takeUntil(this._unsubscribeAll)).subscribe((value) => {
            if (value === true) {
                this.dataForm.get('agendaNo').addValidators(Validators.required);
            } else {
                this.dataForm.get('agendaNo').patchValue(null);
                this.dataForm.get('agendaNo').removeValidators(Validators.required);
            }
            this.dataForm.get('agendaNo').updateValueAndValidity();
            this._changeDetectorRef.markForCheck();
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
        this.selectedMeeting$.pipe(takeUntil(this._unsubscribeAll)).subscribe((value) => {
            if (value != null) {
                const queryList = new QueryListModel({});
                queryList.catId = value.id;
                queryList.page = 0;
                queryList.pageSize = 999;
                this._service.getAgendas(queryList).pipe(takeUntil(this._unsubscribeAll)).subscribe((itemAgendas) => {

                });
            }
        });
        if (this.data.refAttachments && this.data.refAttachments.length > 0) {
            this.refAttachments = this.data.refAttachments;
            this.isReferenceAttachmentPanel = true;
        }
        this.agendas$ = this._service.agendas$;
        this.agendaRefAttachment$ = this._service.agendaRefAttachment$;
        this._service.agendaRefAttachment$.pipe(takeUntil(this._unsubscribeAll)).subscribe((value) => {
            this.agendaRefAttachment = value;
        });

    }

    openMeetingSearch(): void {
        this._meetingSearchForm = this._matDialog.open(MeetingSearchComponent, {
            width: '90%',
            height: '90%',
        });
        this._meetingSearchForm.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe((item: MeetingListModel) => {
            if (item) {
                this._selectedMeeting.next(item);
            } else {
                this._selectedMeeting.next(null);
            }
        });
    }


    openFileHistory(): void {
        this._fileHistoryPopup = this._matDialog.open(FileHistoryComponent, {
            panelClass: 'standard-dialog',
            width: '80%',
            height: '99%',
            data: this.data.attachmentHistories
        });
    }
    viewAgendaAttachment(item: MeetingAgendaModel): void {
        if (item && item.id) {
            this.selectedAgendaId = item.id;
            this._service.getAgendaRefAttachment(item.id).pipe(take(1)).subscribe();
        } else {
            this.selectedAgendaId = null;
        }
    }

    selectedAtendaAttachment(): void {
        if (this.selectedAgendaId) {
            if (!this.refAttachments.find(c => c.agendaId === this.selectedAgendaId)) {
                this.refAttachments.push(this.agendaRefAttachment);
            }
            this.matDrawer.close();
        }
    }
    processPermission(): void {
        this.attachments.forEach((item) => {
            this.processItemPermission(item);
        });
    }
    processItemPermission(value: MeetingAttachmentModel): void {
        let notAssignPermissions = this.attendees;
        if (value.permissions.length > 0) {
            notAssignPermissions = this.attendees.filter(c => !value.permissions.map(a => a.userId).includes(c.userId));
        }
        notAssignPermissions.forEach((item) => {
            const obj = new AttachmentPermissionModel({});
            obj.id = 0;
            obj.meetingAttachmentId = value.id;
            obj.userId = item.userId;
            obj.isRead = true;
            obj.isDownload = true;
            obj.name = item.name;
            value.permissions.push(obj);
        });
        value.permissions = value.permissions.filter(c => this.attendees.map(a => a.userId).includes(c.userId));

    }
    reloadOptionSelect(): void {
        this._optionPresenters.next(this.allUsers.filter(c => !this.selectPresenters.find(a => a.id === c.id) && !this.selectExcludeUsers.find(a => a.id === c.id)));
        this._optionExcludeUsers.next(this.users.filter(c => !this.selectPresenters.find(a => a.id === c.id) && !this.selectExcludeUsers.find(a => a.id === c.id)));
    }

    // Presenter Process
    addPresenter(): void {
        if (!this.selectPresenter) { return; }
        const selectData = this.selectPresenters.find(c => c.id === this.selectPresenter);
        if (selectData) { return; }
        const addData = this.allUsers.find(c => c.id === this.selectPresenter);
        if (addData) {
            this.selectPresenters.push(addData);
        }
        this.reloadOptionSelect();
        this.selectPresenter = null;
    }
    removePresenter(item: UserListModel): void {
        this.selectPresenters = this.selectPresenters.filter(c => c.id !== item.id);
        this.reloadOptionSelect();
    }

    //Exclude User Process
    addExcludeUser(): void {
        if (!this.selectExcludeUser) { return; }
        const selectData = this.selectExcludeUsers.find(c => c.id === this.selectExcludeUser);
        if (selectData) { return; }
        const addData = this.users.find(c => c.id === this.selectExcludeUser);
        if (addData) {
            this.selectExcludeUsers.push(addData);
        }
        this.reloadOptionSelect();
        this.selectExcludeUser = null;
    }
    removeExcludeUser(item: UserListModel): void {
        this.selectExcludeUsers = this.selectExcludeUsers.filter(c => c.id !== item.id);
        this.reloadOptionSelect();
    }

    // PresenterAttachment Process

    addPresenterAttachment(): void {
        if (this.action === 'add') {
            if (!this.presenterAttachment) { return; }
            const checkExist = this.presenterAttachments.find(c => c.fileName === this.presenterAttachment.fileName);
            if (checkExist) {
                Swal.fire('', 'This file already exists.');
                return;
            }
            const addData = new MeetingAttachmentModel(this.presenterAttachment);
            addData.isNew = true;
            this.presenterAttachments.push(addData);
            this.presenterAttachment = null;
        }
        else {
            if (!this.presenterAttachment) { return; }
            const checkExist = this.presenterAttachments.find(c => c.fileName === this.presenterAttachment.fileName);
            if (checkExist) {
                Swal.fire('', 'This file already exists.');
                return;
            }

            const obj = new MeetingAgendaAttachmentFormModel({});
            obj.uid = this.presenterAttachment.uid;
            obj.agendaId = this.data.id;
            obj.documentTypeId = (this.documentType ? this.documentType.id : null);
            obj.attachmentType = 'presenterAttachment';
            this._service.presenterAttachmentAdd(obj).pipe(take(1)).subscribe(() => {
                this.reloadData();
            });
        }
    }
    deletePresenterAttachment(item: MeetingAttachmentModel): void {
        if (this.action === 'add') {
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
        } else {
            if (!item) { return; }
            Swal.fire({
                title: '',
                text: 'Do you want to delete this item?',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
            }).then((result) => {
                if (result.isConfirmed) {
                    this._service.presenterAttachmentDelete(item.id).pipe(take(1)).subscribe({
                        next: () => {
                            Swal.fire('', 'Data has been deleted.').then(() => {
                                this.reloadData();
                            });
                        }
                    });
                }
            });
        }
    }

    //Attachment Process
    addAttachment(): void {
        if (this.action === 'add') {
            if (!this.attachment) { return; }
            const checkExist = this.attachments.find(c => c.fileName === this.attachment.fileName && c.documentTypeId === (this.documentType ? this.documentType.id : null));
            if (checkExist) {
                Swal.fire('', 'This file already exists.');
                return;
            }

            const addData = new MeetingAttachmentModel(this.attachment);
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
        } else {
            if (!this.attachment) { return; }
            const checkExist = this.attachments.find(c => c.fileName === this.attachment.fileName && c.documentTypeId === (this.documentType ? this.documentType.id : null));
            if (checkExist) {
                Swal.fire('', 'This file already exists.');
                return;
            }

            const obj = new MeetingAgendaAttachmentFormModel({});
            obj.uid = this.attachment.uid;
            obj.agendaId = this.data.id;
            obj.documentTypeId = (this.documentType ? this.documentType.id : null);
            obj.attachmentType = 'attachment';
            this._service.attachmentAdd(obj).pipe(take(1)).subscribe(() => {
                this.reloadData();
            });

        }
    }

    multipleDeleteAttachment(): void {
        const selectAttachments = this.attachments.filter(c => c.isCheck === true);
        if (!selectAttachments || selectAttachments.length === 0) {
            return;
        }
        if (this.action === 'add') {
            Swal.fire({
                title: '',
                text: 'Do you want to delete this item?',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
            }).then((result) => {
                if (result.isConfirmed) {
                    this.attachments = this.attachments.filter(c => c.isCheck === false);
                    this.sortAttachment();
                }
            });
        } else {
            Swal.fire({
                title: '',
                text: 'Do you want to delete this item?',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
            }).then((result) => {
                if (result.isConfirmed) {
                    const requestDatas: any = [];
                    selectAttachments.forEach((item) => {
                        requestDatas.push(this._service.attachmentDelete(item.id));
                    });
                    of(...requestDatas)
                        .pipe(
                            concatMap((req: Observable<any>) => req),
                            takeLast(1)
                        )
                        .subscribe(() => {
                            this.reloadData();
                        });
                }
            });
        }
    }
    deleteAttachment(item: MeetingAttachmentModel): void {
        this.sortAttachments.sort = 'none'
        if (this.action === 'add') {
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
        } else {
            if (!item || !item.id) { return; }
            Swal.fire({
                title: '',
                text: 'Do you want to delete this item?',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
            }).then((result) => {
                if (result.isConfirmed) {
                    this._service.attachmentDelete(item.id).pipe(take(1)).subscribe({
                        next: () => {
                            Swal.fire('', 'Data has been deleted.').then(() => {
                                this.reloadData();
                            });
                        }
                    });
                }
            });
        }
    }

    reloadData(): void {
        this._service.getData(this.data.id)
            .pipe(take(1)).subscribe((value: MeetingAgendaModel) => {
                this.attachment = null;
                this.documentType = null;
                if(this.attachmentInput){
                    this.attachmentInput.clearOutput();
                }
                if(this.presenterAttachmentInput){
                    this.presenterAttachmentInput.clearOutput();
                }

                this.attachments = (value ? value.attachments : []);
                this.presenterAttachments = (value ? value.presenterAttachments : []);
                this.data.attachmentHistories = (value ? value.attachmentHistories : []);
                this.processPermission();
            });
    }

    sortAttachment(): void {
        this.attachments = this.attachments.sort((first, second) => 0 - (first.pos > second.pos ? -1 : 1));
        this.attachments.forEach((item, index) => {
            item.pos = index + 1;
        });

    }

    toggleAllAttachment(event: MatCheckboxChange): void {
        if (event.checked) {
            this.attachments.forEach((item) => { item.isCheck = true; });
        } else {
            this.attachments.forEach((item) => { item.isCheck = false; });
        }
    }

    createDataForm(): UntypedFormGroup {
        return this._formBuilder.group({
            'id': [(this.data.id ? this.data.id : 0), [Validators.required]],
            'pos': [(this.data.pos ? this.data.pos : null)],
            'meetingId': [this.data.meetingId, [Validators.required]],
            'parentId': [this.data.parentId],
            'isVote': [this.data.isVote || false, [Validators.required]],
            'isVoteOpen': [this.data.isVoteOpen || false, [Validators.required]],
            'isConfirm': [this.data.isConfirm || false, [Validators.required]],
            'isCustom': [this.data.isCustom || false, [Validators.required]],
            'agendaNo': [this.data.agendaNo, [Validators.maxLength(40), CustomValidator.whiteSpace, (this.data.isCustom ? Validators.required : Validators.nullValidator)]],
            'title': [this.data.title, [Validators.required, Validators.maxLength(900), CustomValidator.whiteSpace]],
            'description': [this.data.description, [Validators.maxLength(4000), CustomValidator.whiteSpace]],
            'useTime': [this.data.useTime !== 0 ? this.data.useTime : null ],
            'excludeUsers': [(this.data.excludeUsers ? this.data.excludeUsers.map(c => c.id) : [])],
            'presenters': [this.data.presenters ? this.data.presenters.map(c => c.id) : []],
        });
    }

    singlePermission(item: MeetingAttachmentModel): void {
        this.sortAttachments.sort = 'none'
        item.isCheck = true;
        this.openPermission();
    }
    openPermission(): void {
        const inputData: InputFormData<MeetingAttachmentModel[]> = new InputFormData<MeetingAttachmentModel[]>();
        const selectDatas = this.attachments.filter(c => c.isCheck === true);
        if (!selectDatas) { return; }
        inputData.data = selectDatas;
        inputData.action = this.action;
        this._formPopup = this._matDialog.open(AgendaAttachmentPermissionComponent, {
            panelClass: 'standard-dialog',
            width: '80%',
            height: '99%',
            data: inputData
        });
        this._formPopup.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe((values: MeetingAttachmentModel[]) => {
            if (this.attachments && this.attachments.length > 0) {
                this.isAllCheck = false;
                this.attachments.forEach((element) => {
                    element.isCheck = false;
                });
                if(this.action === 'edit'){
                    this.reloadData();
                }
            }
        });
    }

    drop(event: CdkDragDrop<MeetingAttachmentModel>): void {
        this.sortAttachments.sort = 'none'
        if (this.action === 'add') {
            const moveObj = this.attachments[event.previousIndex];
            const replaceObj = this.attachments[event.currentIndex];
            if (moveObj && replaceObj) {
                const movePos = moveObj.pos;
                const replacePos = replaceObj.pos;
                moveObj.pos = replacePos;
                replaceObj.pos = movePos;
                moveItemInArray(this.attachments, event.previousIndex, event.currentIndex);
            }
        } else {
            moveItemInArray(this.attachments, event.previousIndex, event.currentIndex);
            if (event.item && event.item.data && event.currentIndex >= 0) {
                const obj = new MeetingAgendaAttachmentFormModel({});
                obj.attachmentId = event.item.data.attachmentId;
                obj.pos = event.currentIndex + 1;
                obj.id = event.item.data.id;
                this._service.attachmentPos(obj).subscribe({
                    next: () => {
                        this.reloadData();
                    }
                });
            }
        }
    }

    move(attachment: MeetingAttachmentModel, previousIndex: number, currentIndex: number): void {
        this.sortAttachments.sort = 'none'
        if (this.action === 'add') {
            const replaceObj = this.attachments[currentIndex];
            if (!attachment || currentIndex < 0 || currentIndex > this.attachments.length - 1) { return; }
            const movePos = attachment.pos;
            const replacePos = replaceObj.pos;
            attachment.pos = replacePos;
            replaceObj.pos = movePos;
            moveItemInArray(this.attachments, previousIndex, currentIndex);
        } else {
            if (!attachment || currentIndex < 0 || currentIndex > this.attachments.length - 1) { return; }
            if (attachment && currentIndex >= 0) {
                const obj = new MeetingAgendaAttachmentFormModel({});
                obj.attachmentId = null;
                obj.pos = currentIndex + 1;
                obj.id = attachment.id;
                this._service.attachmentPos(obj).subscribe({
                    next: () => {
                        this.reloadData();
                    }
                });
            }
        }
    }

    replaceFile(value: MeetingAttachmentModel, isAnnotation: boolean): void {
        this.sortAttachments.sort = 'none'
        const inputData: InputFormData<MeetingAttachmentModel> = new InputFormData<MeetingAttachmentModel>();
        inputData.data = value;
        if (isAnnotation) {
            inputData.action = 'annotation';
        } else {
            inputData.action = 'replace';
        }
        this._replaceFilePopup = this._matDialog.open(ReplaceAttachmentFormComponent, {
            panelClass: 'standard-dialog',
            width: '80%',
            data: inputData
        });
        this._replaceFilePopup.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe((returnData: AttachmentModel) => {
            if (returnData) {
                this.reloadData();
            }
        });
    }


    saveData(): void {
        if (this.action === 'add') { this.create(); } else { this.update(); }
    }
    create(): void {
        if (this.dataForm.valid) {
            const postData = new MeetingAgendaFormModel(this.dataForm.getRawValue());
            if(postData.useTime == null){
                postData.useTime = 0;
            }
            if (this.attachments && this.attachments.length > 0) {
                postData.attachments = this.attachments.map(c => new AttachmentFormModel(c));
            } else {
                postData.attachments = [];
            }
            if (this.presenterAttachments && this.presenterAttachments.length > 0) {
                postData.presenterDocuments = this.presenterAttachments.map(c => new AttachmentFormModel(c));
            }
            else {
                postData.presenterDocuments = [];
            }
            if (this.selectExcludeUsers && this.selectExcludeUsers.length > 0) {
                postData.excludeUsers = this.selectExcludeUsers.map(c => c.id);
            }
            else {
                postData.excludeUsers = [];
            }
            if (this.selectPresenters && this.selectPresenters.length > 0) {
                postData.presenters = this.selectPresenters.map(c => c.id);
            }
            else {
                postData.presenters = [];
            }
            if (this.refAttachments && this.refAttachments.length > 0) {
                postData.attachmentReferences = this.refAttachments.map(c => c.agendaId);
            }
            else {
                postData.attachmentReferences = [];
            }
            Swal.fire({
                title: '',
                text: 'Do you want to save?',
                showCancelButton: true,
                confirmButtonText: 'Save',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.dataForm.disable();
                    this._service.create(postData).subscribe({
                        next: (resp: any) => {
                            Swal.fire('', 'Data has been saved.').then(() => {
                                this._matDialogRef.close(resp);
                            });
                        },
                        error: () => {
                            this.dataForm.enable();
                        }
                    });
                }
            });
        }
    }
    update(): void {
        if (this.dataForm.valid) {
            const postData = new MeetingAgendaFormModel(this.dataForm.getRawValue());
            if(postData.useTime == null){
                postData.useTime = 0;
            }
            if (this.attachments && this.attachments.length > 0) {
                postData.attachments = this.attachments.map(c => new AttachmentFormModel(c));
            } else {
                postData.attachments = [];
            }
            if (this.presenterAttachments && this.presenterAttachments.length > 0) {
                postData.presenterDocuments = this.presenterAttachments.map(c => new AttachmentFormModel(c));
            }
            else {
                postData.presenterDocuments = [];
            }
            if (this.selectExcludeUsers && this.selectExcludeUsers.length > 0) {
                postData.excludeUsers = this.selectExcludeUsers.map(c => c.id);
            }
            else {
                postData.excludeUsers = [];
            }
            if (this.selectPresenters && this.selectPresenters.length > 0) {
                postData.presenters = this.selectPresenters.map(c => c.id);
            }
            else {
                postData.presenters = [];
            }
            if (this.refAttachments && this.refAttachments.length > 0) {
                postData.attachmentReferences = this.refAttachments.map(c => c.agendaId);
            }
            else {
                postData.attachmentReferences = [];
            }
            Swal.fire({
                title: '',
                text: 'Do you want to save your changes ?',
                showCancelButton: true,
                confirmButtonText: 'Save',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.dataForm.disable();
                    this._service.update(postData).subscribe({
                        next: (resp: any) => {
                            Swal.fire('', 'Data has been saved.').then(() => {
                                this._matDialogRef.close(resp);
                            });
                        },
                        error: () => {
                            this.dataForm.enable();
                        }
                    });
                }
            });
        }
    }

    openRefAttachmentForm(): void {
        this._service.clearAgenda();
        this.matDrawer.open();
    }

    removeRefAgenda(item: AgendaRefAttachmentModel): void {
        Swal.fire({
            title: '',
            text: 'Do you want to delete this item?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
        }).then((result) => {
            if (result.isConfirmed) {
                this.refAttachments = this.refAttachments.filter(c => c !== item);
            }
        });

    }
    close(): void {
        this._matDialogRef.close();
    }

    closeSlide(): void {
        if (this.matDrawer.open) {
            this.matDrawer.close();
        }
    }

    setAttachmentsSort(key: string): void {
        if (key === this.sortAttachments.fieldName) {
            if (this.sortAttachments.sort === 'asc') {
                this.sortAttachments.sort = 'desc';
            } else if (this.sortAttachments.sort === 'desc') {
                this.sortAttachments.sort = 'none';
            } else {
                this.sortAttachments.sort = 'asc';
            }
        } else {
            this.sortAttachments.fieldName = key;
            this.sortAttachments.sort = 'asc';
        }
        const dataSort = this.sortArrayByFieldDragDrop(this.attachments,this.sortAttachments.fieldName,this.sortAttachments.sort)

        const obj = dataSort.map((item, index) => {
            const obj = new MeetingAgendaAttachmentFormModel({});
            obj.attachmentId = null;
            obj.pos = index + 1;
            obj.id = item.id;
            return obj;
        });

            this._service.attachmentPosBatch(obj).subscribe({
                next: () => {
                    this.reloadData();
                }
            });
    }

    setPresentersSort(key: string): void {
        if (key === this.sortPresenters.fieldName) {
            this.sortPresenters.sort = this.sortPresenters.sort === 'asc' ? 'desc' : 'asc'
        } else {
            this.sortPresenters.fieldName = key
            this.sortPresenters.sort = 'asc'
        }

    }

    sortArrayByFieldDragDrop(array: MeetingAttachmentModel[], fieldName: string, sort: string): MeetingAttachmentModel[] {
        const list = [...array]
        if (sort === 'none') {
            return this.attachmentsRememberSort; // No sorting applied
        }

        const dataSort = list.sort((a, b) => {
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
        return dataSort
    }

    sortArrayByField(array: MeetingAttachmentModel[], fieldName: string, sort: string): MeetingAttachmentModel[] {

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

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    changeColor(event: any): void {
        this.dataForm.get('color').patchValue(event);
    }
    ngAfterContentChecked(): void {
        return
    }

}
