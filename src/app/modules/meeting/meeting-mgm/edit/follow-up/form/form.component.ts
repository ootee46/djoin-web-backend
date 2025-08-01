import { AfterContentChecked, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AttachmentFormModel, AttachmentModel } from 'app/models/attachment.model';
import {
    FollowUpAttachmentModel,
    FollowUpAttendeeModel,
    FollowUpFormModel,
    FollowUpModel,
} from 'app/models/follow-up.model';
import { InputFormData } from 'app/models/input-form-data';
import { CustomValidator } from 'app/validators/custom.validate';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

import { MeetingMgmService } from '../../../meeting-mgm.service';
import { FollowUpService } from '../follow-up.service';

@Component({
  selector: 'follow-up-form',
  templateUrl: './form.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class FollowUpFormComponent implements OnInit, OnDestroy, AfterContentChecked {
    @ViewChild('myForm') myForm: NgForm;
    action: string;
    dialogTitle: string;
    data: FollowUpModel;
    dataForm: UntypedFormGroup;
    kw: string;
    _filterAttendees: BehaviorSubject<FollowUpAttendeeModel[]> = new BehaviorSubject<FollowUpAttendeeModel[]>([]);
    attendees: FollowUpAttendeeModel[] = [];
    filterAttendees: FollowUpAttendeeModel[] = [];
    selectedAttendees: FollowUpAttendeeModel[] = [];
    attachments: FollowUpAttachmentModel[] = [];
    selectedAttendee: number =  null;

    selectedAttachment: AttachmentModel = null;
    private _unsubscribeAll: Subject<any> = new Subject();
    constructor(
        private _matDialogRef: MatDialogRef<FollowUpFormComponent>,
        @Inject(MAT_DIALOG_DATA) private input: InputFormData<FollowUpModel>,
        private _formBuilder: UntypedFormBuilder,
        private _service: FollowUpService,
        private _meetingService: MeetingMgmService
    ) { }

    get filterAttendees$(): Observable<FollowUpAttendeeModel[]> {
        return this._filterAttendees.asObservable();
    }

    ngOnInit(): void {
        this.kw = null;
        this.action = this.input.action;
        this.dialogTitle = (this.action === 'add' ? 'Create New Follow Up' : 'Update');
        this.data = this.input.data;
        if(this.data.followUpAttendees){
            this.selectedAttendees = this.data.followUpAttendees;
        }
        if(this.data.followUpAttachments){
            this.attachments = this.data.followUpAttachments;
        }
        this._meetingService.attendees$.pipe(takeUntil(this._unsubscribeAll)).subscribe((value)=>{
            if(value){
                this.attendees = value.map(c=>new FollowUpAttendeeModel(c));
                this._filterAttendees.next(this.attendees.filter(c=>this.selectedAttendees.find(a=>a.userId === c.userId) == null));
            }
        });
        this.dataForm = this.createDataForm();
    }

    createDataForm(): UntypedFormGroup {
        return this._formBuilder.group({
            id:[this.data.id || 0 ,[ Validators.required]],
            meetingId:[this.data.meetingId, [Validators.required]],
            title:[this.data.title, [Validators.required, Validators.maxLength(900), CustomValidator.whiteSpace]],
            detail:[this.data.detail, [Validators.required, Validators.maxLength(2000), CustomValidator.whiteSpace]],
            remark:[this.data.remark, [Validators.maxLength(900), CustomValidator.whiteSpace]],
            startDate:[this.data.startDate, [Validators.required]],
            endDate:[this.data.endDate, [Validators.required]],
            sender:[this.data.sender, [Validators.required, Validators.maxLength(900), CustomValidator.whiteSpace]],
            cc:[this.data.cc],
            isVisabled:[this.data.isVisabled],
            attendees:[this.selectedAttendees.map(c=>c.userId),[Validators.required]],
            status:[this.data.status, [Validators.required]],
        });
    }
    saveData(): void {
        if (this.action === 'add') { this.create(); } else { this.update(); }
    }
    addAttendee(): void {
        if(this.selectedAttendee && this.selectedAttendees.find(c=>c.userId === this.selectedAttendee) == null){
            const attendee = this.attendees.find(c=>c.userId === this.selectedAttendee);
            if(attendee != null){
                this.selectedAttendees.push(attendee);
            }
            this._filterAttendees.next(this.attendees.filter(c=>this.selectedAttendees.find(a=>a.userId === c.userId) == null));
            this.selectedAttendee = null;
            this.dataForm.get('attendees').patchValue(this.selectedAttendees.map(c=>c.userId));
        }
    }

    deleteAttendee(id: number): void{
        this.selectedAttendees = this.selectedAttendees.filter(c=>c.userId !== id);
        this._filterAttendees.next(this.attendees.filter(c=>this.selectedAttendees.find(a=>a.userId === c.userId) == null));
        this.dataForm.get('attendees').patchValue(this.selectedAttendees.map(c=>c.userId));
    }
    addAttachment(): void{
        if(this.selectedAttachment){
            this.attachments.push(new FollowUpAttachmentModel(this.selectedAttachment));
            this.selectedAttachment = null;
        }
    }
    deleteAttachment(item: FollowUpAttachmentModel): void{
        this.attachments = this.attachments.filter(c=>c !== item);
    }
    create(): void {
        if (this.dataForm.valid) {
            const postData = new FollowUpFormModel(this.dataForm.getRawValue());
            if(this.selectedAttendees && this.selectedAttendees.length > 0){
                postData.attendees = this.selectedAttendees.map(c=>c.userId);
            }
            if(this.attachments && this.attachments.length > 0){
                postData.attachments = this.attachments.map(c=>new AttachmentFormModel(c));
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
            const postData = new FollowUpFormModel(this.dataForm.getRawValue());
            if(this.selectedAttendees && this.selectedAttendees.length > 0){
                postData.attendees = this.selectedAttendees.map(c=>c.userId);
            }
            if(this.attachments && this.attachments.length > 0){
                postData.attachments = this.attachments.map(c=>new AttachmentFormModel(c));
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
