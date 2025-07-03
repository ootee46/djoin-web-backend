import { Component, OnInit, ViewEncapsulation, Inject, OnDestroy, ViewChild, AfterContentChecked } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { InputFormData } from 'app/models/input-form-data';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { ApproverGroupModel, ApproverPositionModel, ApproverStepModel } from 'app/models/standard.model';
import { ApproverStepService } from '../approver-step.service';
import {  ApproverStepItemModel } from 'app/models/approver-step-item.model';
import { UserModel } from 'app/models/user.model';
import { CustomValidator } from 'app/validators/custom.validate';

@Component({
    selector: 'approver-step-popup1',
    templateUrl: './popup1.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ApproverStepPopup1Component implements OnInit, OnDestroy {
    @ViewChild('myForm') myForm: NgForm;
    action: string;
    dialogTitle: string;
    data: ApproverStepItemModel;
    dataForm: UntypedFormGroup;
    kw: string;
    steps: ApproverStepItemModel[] = [];
    stepIndex: number = null;
    users: UserModel[] = [];
    approverPositions: ApproverPositionModel[] = [];
    approverGroups: ApproverGroupModel[] = [];
    private _unsubscribeAll: Subject<any> = new Subject();
    constructor(
        private _matDialogRef: MatDialogRef<ApproverStepPopup1Component>,
        @Inject(MAT_DIALOG_DATA) private input: InputFormData<ApproverStepItemModel>,
        private _formBuilder: UntypedFormBuilder,
        private _service: ApproverStepService
    ) { }

    ngOnInit(): void {
        this.kw = null;
        this.action = this.input.action;
        this.dialogTitle = (this.action === 'add' ? 'New' : 'Update');
        this.data = this.input.data;
        this.steps = this.input.dataCheck || [];
        if(this.steps.length > 0 && this.action === 'add'){
            this.data.stepType = 'Approve';
        }
        if(this.action === 'edit' && this.input.index != null){
            this.stepIndex = this.input.index;
        }
        this.dataForm = this.createDataForm();
        this._service.users$.pipe(takeUntil(this._unsubscribeAll)).subscribe((value)=>{ this.users = value;});
        this._service.approverPositions$.pipe(takeUntil(this._unsubscribeAll)).subscribe((value)=>{ this.approverPositions = value;});
        this._service.approverGroups$.pipe(takeUntil(this._unsubscribeAll)).subscribe((value)=>{ this.approverGroups = value;});
        this.dataForm.get('type').valueChanges.pipe(takeUntil(this._unsubscribeAll)).subscribe((value)=>{
            this.dataForm.get('userId').patchValue(null);
            this.dataForm.get('approverPositionId').patchValue(null);
            this.dataForm.get('approverGroupId').patchValue(null);
            this.dataForm.get('userId').removeValidators([Validators.required]);
            this.dataForm.get('approverPositionId').removeValidators([Validators.required]);
            this.dataForm.get('approverGroupId').removeValidators([Validators.required]);
            if(value === 'User'){
                this.dataForm.get('userId').addValidators([Validators.required]);
            }else if( value === 'Approver Position'){
                this.dataForm.get('approverPositionId').addValidators([Validators.required]);
            }
            else if( value === 'Approver Team'){
                this.dataForm.get('approverGroupId').addValidators([Validators.required]);
            }
            this.dataForm.get('userId').updateValueAndValidity();
            this.dataForm.get('approverPositionId').updateValueAndValidity();
            this.dataForm.get('approverGroupId').updateValueAndValidity();
        });
    }
    createDataForm(): UntypedFormGroup {
        return this._formBuilder.group({
            'id': [this.data.id || 0],
            'title': [this.data.title, [Validators.required,CustomValidator.whiteSpace, Validators.maxLength(90)]],
            'active': [true, [Validators.required]],
            'userId': [this.data.userId, [(this.data.type === 'User'? Validators.required: Validators.nullValidator)]],
            'pos': [this.data.pos || 0, [Validators.required]],
            'approverPositionId': [this.data.approverPositionId,[(this.data.type === 'Approver Position'? Validators.required: Validators.nullValidator)]],
            'approverGroupId': [this.data.approverGroupId,[(this.data.type === 'Approver Team'? Validators.required: Validators.nullValidator)]],
            'type': [this.data.type, [Validators.required]],
            'stepType': [{value:this.data.stepType, disabled: (this.steps.length > 0 && this.action == 'add') || (this.action == 'edit' && this.stepIndex > 0)}, [Validators.required]],
        });
    }
    saveData(): void {
        if (this.dataForm.valid) {
            const postData = new ApproverStepItemModel(this.dataForm.getRawValue());
            if(this.action === 'add'){
                const nameCheck = this.steps.find(c=>c.title && postData.title && c.title.trim() === postData.title.trim());
                if(nameCheck ){
                    Swal.fire('','This Name already exists.');
                    return;
                }
            }else{
                const nameCheck = this.steps.find(c=>c.title && postData.title && c.title.trim() === postData.title.trim() && c !== this.data);
                if(nameCheck ){
                    Swal.fire('','This Name already exists.');
                    return;
                }
            }
            if(postData.userId != null){
                const obj = this.users.find(c=>c.id === postData.userId);
                if(obj){
                    postData.name = obj.name;
                }
            }
            if(postData.approverPositionId != null){
                const obj = this.approverPositions.find(c=>c.id === postData.approverPositionId);
                if(obj){
                    postData.approverPositionName = obj.title;
                }
            }
            if(postData.approverGroupId != null){
                const obj = this.approverGroups.find(c=>c.id === postData.approverGroupId);
                if(obj){
                    postData.approverGroupName = obj.title;
                }
            }
            Swal.fire({
                title: '',
                text: (this.action === 'edit' ?'Do you want to save your changes ?':'Do you want to save?'),
                showCancelButton: true,
                confirmButtonText: 'Save',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                   this._matDialogRef.close(postData);
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
