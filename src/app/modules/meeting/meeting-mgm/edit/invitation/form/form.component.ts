import { Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { MeetingAttendeeModel } from 'app/models/attendee.model';
import { InputFormData } from 'app/models/input-form-data';
import { InvitationFormModel, InvitationModel } from 'app/models/invitation.model';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { MeetingMgmService } from '../../../meeting-mgm.service';
import { InvitationService } from '../invitation.service';

@Component({
  selector: 'meeting-invitation-form',
  templateUrl: './form.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class InvitationFormComponent implements OnInit, OnDestroy {
    @ViewChild('myForm') myForm: NgForm;
    action: string;
    dialogTitle: string;
    data: InvitationModel;
    dataForm: UntypedFormGroup;
    attendees: MeetingAttendeeModel[];
    private _unsubscribeAll: Subject<any> = new Subject();
    constructor(
        private _matDialogRef: MatDialogRef<InvitationFormComponent>,
        @Inject(MAT_DIALOG_DATA) private input: InputFormData<InvitationModel>,
        private _formBuilder: UntypedFormBuilder,
        private _service: InvitationService,
        private _meetingServices: MeetingMgmService,
    ) { }

    ngOnInit(): void {
        this.action = this.input.action;
        this.dialogTitle = (this.action === 'add' ? 'Create New Invitation' : 'Update');
        this.data = this.input.data;
        this.dataForm = this.createDataForm();
        this._meetingServices.attendees$.pipe(takeUntil(this._unsubscribeAll)).subscribe((value)=>{
            this.attendees = value;
            this.attendees.forEach((item)=>{item.isSelected = false;});
        });
    }
    createDataForm(): UntypedFormGroup {
        return this._formBuilder.group({
            'id': [0,[Validators.required]],
            'meetingId': [this.data.meetingId, [Validators.required]],
            'method': [null, [Validators.required]],
        });
    }
    toggleAll(event: MatCheckboxChange ): void{
        this.attendees.forEach((item)=>{item.isSelected = event.checked;});
    }
    saveData(): void {
        this.create();
    }
    create(): void {
        if (this.dataForm.valid) {
            const postData = new InvitationFormModel(this.dataForm.getRawValue());
            postData.users = this.attendees.filter(c=>c.isSelected === true).map(c=>c.userId);
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
                        next: (resp: InvitationFormModel) => {
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


}
