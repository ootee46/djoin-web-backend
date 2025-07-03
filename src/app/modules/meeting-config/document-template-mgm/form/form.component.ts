import { Component, OnInit, ViewEncapsulation, Inject, OnDestroy, ViewChild, AfterContentChecked } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { InputFormData } from 'app/models/input-form-data';
import { Subject, take, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { DocumentTemplateFormModel, DocumentTemplateModel } from 'app/models/document-template.model';
import { DocumentTemplateMgmService } from '../document-template-mgm.service';
import { AttachmentModel } from 'app/models/attachment.model';
import { CustomValidator } from 'app/validators/custom.validate';

@Component({
    selector: 'document-template-mgm-form',
    templateUrl: './form.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class DocumentTemplateMgmFormComponent implements OnInit, OnDestroy {
    @ViewChild('myForm') myForm: NgForm;
    action: string;
    dialogTitle: string;
    data: DocumentTemplateModel;
    dataForm: UntypedFormGroup;
    kw: string;
    private _unsubscribeAll: Subject<any> = new Subject();
    constructor(
        private _matDialogRef: MatDialogRef<DocumentTemplateMgmFormComponent>,
        @Inject(MAT_DIALOG_DATA) private input: InputFormData<DocumentTemplateModel>,
        private _matDialog: MatDialog,
        private _formBuilder: UntypedFormBuilder,
        private _service: DocumentTemplateMgmService
    ) { }

    ngOnInit(): void {
        this.kw = null;
        this.action = this.input.action;
        this.dialogTitle = (this.action === 'add' ? 'New' : 'Update');
        this.data = this.input.data;
        this.dataForm = this.createDataForm();
    }
    createDataForm(): UntypedFormGroup {
        return this._formBuilder.group({
            'id': [this.data.id || 0 ,[Validators.required]],
            'name': [this.data.name, [Validators.required,CustomValidator.whiteSpace, Validators.maxLength(90)]],
            'detail': [this.data.detail, [Validators.required,CustomValidator.whiteSpace, Validators.maxLength(3900)]],
            'active': [this.data.active, [Validators.required]],
            'attachmentId': [this.data.attachmentId, [Validators.required]]
        });
    }
    saveData(): void {
        if (this.dataForm.valid) {
            const postData = new DocumentTemplateFormModel(this.dataForm.getRawValue());
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
    processRemove(): void{
        this.dataForm.get('attachmentId').patchValue(null);
        this.dataForm.get('attachmentId').updateValueAndValidity();
    }
    processUpload(event: AttachmentModel): void {
        if (event != null) {
            this.dataForm.get('attachmentId').patchValue(event.id);
            this.dataForm.get('attachmentId').updateValueAndValidity();
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
