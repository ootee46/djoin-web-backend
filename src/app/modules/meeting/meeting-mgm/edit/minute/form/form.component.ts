import { Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { MeetingAttendeeModel } from 'app/models/attendee.model';
import { InputFormData } from 'app/models/input-form-data';
import { InvitationFormModel, InvitationModel } from 'app/models/invitation.model';
import { MinuteConfirmFormModel } from 'app/models/minute.model';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { MeetingMgmService } from '../../../meeting-mgm.service';
import { MinuteService } from '../minute.service';

@Component({
    selector: 'minute-confirm-form',
    templateUrl: './form.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class MinuteConfirmFormComponent implements OnInit, OnDestroy {
    @ViewChild('myForm') myForm: NgForm;
    action: string;
    dialogTitle: string;
    data: MinuteConfirmFormModel;
    dataForm: UntypedFormGroup;
    attendees: MeetingAttendeeModel[];
    private _unsubscribeAll: Subject<any> = new Subject();
    constructor(
        private _matDialogRef: MatDialogRef<MinuteConfirmFormComponent>,
        @Inject(MAT_DIALOG_DATA) private input: InputFormData<MinuteConfirmFormModel>,
        private _formBuilder: UntypedFormBuilder,
        private _meetingServices: MeetingMgmService,
        private _service: MinuteService,
        private _splash: FuseSplashScreenService,
    ) { }

    ngOnInit(): void {
        this.action = this.input.action;
        this.dialogTitle = (this.action === 'add' ? 'Create Minutes Confirm' : 'Update');
        this.data = this.input.data;
        this.dataForm = this.createDataForm();
        this._meetingServices.attendees$.pipe(takeUntil(this._unsubscribeAll)).subscribe((value) => {
            this.attendees = value;
            this.attendees.forEach((item) => { item.isSelected = false; });
        });
    }
    createDataForm(): UntypedFormGroup {
        return this._formBuilder.group({
            'confirmDate': [null, [Validators.required]],
            'meetingId': [this.data.meetingId, [Validators.required]]
        });
    }
    toggleAll(event: MatCheckboxChange): void {
        this.attendees.forEach((item) => { item.isSelected = event.checked; });
    }
    saveData(): void {
        this.create();
    }
    create(): void {
        if (this.dataForm.valid) {
            const postData = new MinuteConfirmFormModel(this.dataForm.getRawValue());
            postData.users = this.attendees.filter(c => c.isSelected === true).map(c => c.userId);
            if(postData.users == null || postData.users.length === 0){
                Swal.fire('','Please select at least one user.');
                return;
            }
            Swal.fire({
                title: '',
                text: (this.action === 'edit' ?'Do you want to save your changes ?':'Do you want to save?'),
                showCancelButton: true,
                confirmButtonText: 'Save',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.dataForm.disable();
                    this._splash.show();
                    this._service.sendMinuteConfirm(postData).subscribe({
                        next: (resp: InvitationFormModel) => {
                            this._splash.hide();
                            Swal.fire('', 'Data has been saved.').then(() => {
                                this._matDialogRef.close(resp);
                            });
                        },
                        error: () => {
                            this._splash.hide();
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
