import { Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ApproverStepItemModel } from 'app/models/approver-step-item.model';
import { InputFormData } from 'app/models/input-form-data';
import { ApproverStepModel } from 'app/models/standard.model';
import { CustomValidator } from 'app/validators/custom.validate';
import { Subject, take, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { ApproverStepService } from '../approver-step.service';
import { ApproverStepPopup1Component } from '../popup1/popup1.component';

@Component({
    selector: 'approver-step-form',
    templateUrl: './form.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ApproverStepFormComponent implements OnInit, OnDestroy {
    @ViewChild('myForm') myForm: NgForm;
    action: string;
    dialogTitle: string;
    data: ApproverStepModel;
    dataForm: UntypedFormGroup;
    kw: string;
    steps: ApproverStepItemModel[] = [];
    private _unsubscribeAll: Subject<any> = new Subject();
    private _formPopup: MatDialogRef<ApproverStepPopup1Component>;
    constructor(
        private _matDialogRef: MatDialogRef<ApproverStepFormComponent>,
        @Inject(MAT_DIALOG_DATA) private input: InputFormData<ApproverStepModel>,
        private _matDialog: MatDialog,
        private _formBuilder: UntypedFormBuilder,
        private _service: ApproverStepService
    ) { }

    ngOnInit(): void {
        this.kw = null;
        this.action = this.input.action;
        this.dialogTitle = (this.action === 'add' ? 'New' : 'Update');
        this.data = this.input.data;
        this.dataForm = this.createDataForm();
        if(this.data && this.data.items){
            this.steps = this.data.items;
            this.dataForm.get('items').patchValue(this.steps);
            this.dataForm.get('items').updateValueAndValidity();
        }
    }
    createDataForm(): UntypedFormGroup {
        return this._formBuilder.group({
            'id': [this.data.id || 0 ,[Validators.required]],
            'title': [this.data.title, [Validators.required,CustomValidator.whiteSpace, Validators.maxLength(90)]],
            'active': [this.data.active, [Validators.required]],
            'items':[null,[Validators.required]]
        });
    }
    saveData(): void {
        if (this.dataForm.valid) {
            const postData = new ApproverStepModel(this.dataForm.getRawValue());
            postData.items = this.steps.map((c: any)=>new ApproverStepItemModel(c));
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

    create(): void {
        const inputData: InputFormData<ApproverStepItemModel> = new InputFormData<ApproverStepItemModel>();
        inputData.data = new ApproverStepItemModel({});
        inputData.action = 'add';
        inputData.dataCheck = this.steps;
        this._formPopup = this._matDialog.open(ApproverStepPopup1Component, {
            panelClass: 'popup-dialog',
            width: '75%',
            data: inputData
        });
        this._formPopup.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe((resp: ApproverStepItemModel) => {
            if(resp){
                this.steps.push(resp);
                this.updatePosition();
                this.dataForm.get('items').patchValue(this.steps);
                this.dataForm.get('items').updateValueAndValidity();
            }
        });
    }
    edit(rowData: ApproverStepItemModel, stepIndex: number): void {
        const inputData: InputFormData<ApproverStepItemModel> = new InputFormData<ApproverStepItemModel>();
        inputData.data = rowData;
        inputData.action = 'edit';
        inputData.dataCheck = this.steps;
        inputData.index = stepIndex;
        this._formPopup = this._matDialog.open(ApproverStepPopup1Component, {
            panelClass: 'popup-dialog',
            width: '75%',
            data: inputData
        });
        this._formPopup.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe((resp: ApproverStepItemModel) => {
            if(resp){
                Object.assign(rowData,resp);
                this.updatePosition();
                this.dataForm.get('items').patchValue(this.steps);
                this.dataForm.get('items').updateValueAndValidity();
            }
        });
    }

    updatePosition(): void {
        this.steps.forEach((item,index)=>{
            item.pos = index + 1;
        });
    }

    deleteData(rowData: ApproverStepItemModel): void {
        Swal.fire({
            title: '',
            text: 'Do you want to delete this item?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                this.steps = this.steps.filter(c=>c !== rowData);
                this.updatePosition();
            }
        });
    }
    close(): void {
        this._matDialogRef.close();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}
