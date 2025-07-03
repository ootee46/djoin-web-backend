import { Component, OnInit, ViewEncapsulation, Inject, OnDestroy, ViewChild, AfterContentChecked } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { InputFormData } from 'app/models/input-form-data';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { ApproverConfigModel } from 'app/models/approver-config.model';
import { ApproverConfigService } from '../approver-config.service';
import { AgendaApproverFlowModel, AgendaConfidentialModel, AgendaObjectiveModel, ApproverStepModel, MeetingSubTypeModel, MeetingTypeModel } from 'app/models/standard.model';

@Component({
    selector: 'approver-config-form',
    templateUrl: './form.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ApproverConfigFormComponent implements OnInit, OnDestroy {
    @ViewChild('myForm') myForm: NgForm;
    action: string;
    dialogTitle: string;
    data: ApproverConfigModel;
    dataForm: UntypedFormGroup;
    kw: string;
    meetingTypes$: Observable<MeetingTypeModel[]>;
    meetingSubTypes$: Observable<MeetingSubTypeModel[]>;
    agendaObjectives$: Observable<AgendaObjectiveModel[]>;
    agendaConfidentials$: Observable<AgendaConfidentialModel[]>;
    agendaApproverFlows$: Observable<AgendaApproverFlowModel[]>;
    approverSteps$: Observable<ApproverStepModel[]>;
    private _unsubscribeAll: Subject<any> = new Subject();
    constructor(
        private _matDialogRef: MatDialogRef<ApproverConfigFormComponent>,
        @Inject(MAT_DIALOG_DATA) private input: InputFormData<ApproverConfigModel>,
        private _matDialog: MatDialog,
        private _formBuilder: UntypedFormBuilder,
        private _service: ApproverConfigService
    ) { }

    ngOnInit(): void {
        this.kw = null;
        this.action = this.input.action;
        this.dialogTitle = (this.action === 'add' ? 'New' : 'Update');
        this.data = this.input.data;
        this.meetingTypes$ = this._service.meetingTypes$;
        this.meetingSubTypes$ = this._service.meetingSubTypes$;
        this.agendaObjectives$ = this._service.agendaObjectives$;
        this.agendaConfidentials$ = this._service.agendaConfidentials$;
        this.agendaApproverFlows$ = this._service.agendaApproverFlows$;
        this.approverSteps$ = this._service.approverSteps$;
        this.dataForm = this.createDataForm();
        setTimeout(() => {
            if(this.data.meetingTypeId){
                this._service.getMeetingSubTypes(this.data.meetingTypeId.toString()).pipe(take(1)).subscribe();
            }
        }, 0);
    }

    getSubMeetingType(value: number): void{
        this.dataForm.get('meetingSubTypeId').patchValue(null);
        this._service.getMeetingSubTypes(value.toString()).pipe(take(1)).subscribe();
    }
    createDataForm(): UntypedFormGroup {
        return this._formBuilder.group({
            'id': [this.data.id || 0],
            'meetingTypeId': [this.data.meetingTypeId, [Validators.required]],
            'meetingSubTypeId': [this.data.meetingSubTypeId, [Validators.required]],
            'agendaObjectiveId': [this.data.agendaObjectiveId, [Validators.required]],
            'agendaConfidentialId': [this.data.agendaConfidentialId, [Validators.required]],
            'agendaApproverFlowId': [this.data.agendaApproverFlowId, [Validators.required]],
            'preMeetingApproverId': [this.data.preMeetingApproverId, [Validators.required]],
            'postMeetingApproverId': [this.data.postMeetingApproverId, [Validators.required]],
            'cancelApproverId': [this.data.cancelApproverId, [Validators.required]],
            'editApproverId': [this.data.editApproverId, [Validators.required]],
            'reserveRejectType': [this.data.reserveRejectType, [Validators.required]],
        });
    }
    saveData(): void {
        if (this.dataForm.valid) {
            const postData = new ApproverConfigModel(this.dataForm.getRawValue());
            Swal.fire({
                title: '',
                text: (this.action === 'edit' ?'Do you want to save your changes ?':'Do you want to save?'),
                showCancelButton: true,
                confirmButtonText: 'Save',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.dataForm.disable();
                    if (this.action === 'edit') {
                        this._service.update(postData).pipe(take(1)).subscribe({
                            next: (resp: any) => {
                                Swal.fire('', 'Data has been saved.').then(() => {
                                    this.dataForm.enable();
                                    this._matDialogRef.close(resp);
                                });
                            },
                            error: () => {
                            setTimeout(() => {
                                this.dataForm.enable();
                            }, 0);
                        }
                        });
                    }
                    else {
                        this._service.create(postData).pipe(take(1)).subscribe({
                            next: (resp: any) => {
                                Swal.fire('', 'Data has been saved.').then(() => {
                                    this.dataForm.enable();
                                    this._matDialogRef.close(resp);
                                });
                            },
                            error: () => {
                            setTimeout(() => {
                                this.dataForm.enable();
                            }, 0);
                        }
                        });
                    }
                }
            });
        }
    }
    close(): void {
        this._matDialogRef.close();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}
