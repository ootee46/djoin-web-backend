import { Component, OnInit, ViewEncapsulation, Inject, OnDestroy, ViewChild, AfterContentChecked } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { InputFormData } from 'app/models/input-form-data';
import { Subject, take, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { AgendaConfidentialModel } from 'app/models/standard.model';
import { AgendaConfidentialService } from '../agenda-confidential.service';
import { CustomValidator } from 'app/validators/custom.validate';

@Component({
    selector: 'agenda-confidential-form',
    templateUrl: './form.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AgendaConfidentialFormComponent implements OnInit, OnDestroy {
    @ViewChild('myForm') myForm: NgForm;
    action: string;
    dialogTitle: string;
    data: AgendaConfidentialModel;
    dataForm: UntypedFormGroup;
    kw: string;
    private _unsubscribeAll: Subject<any> = new Subject();
    constructor(
        private _matDialogRef: MatDialogRef<AgendaConfidentialFormComponent>,
        @Inject(MAT_DIALOG_DATA) private input: InputFormData<AgendaConfidentialModel>,
        private _matDialog: MatDialog,
        private _formBuilder: UntypedFormBuilder,
        private _service: AgendaConfidentialService
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
            'title': [this.data.title, [Validators.required,CustomValidator.whiteSpace, Validators.maxLength(90)]],
            'active': [this.data.active, [Validators.required]]
        });
    }
    saveData(): void {
        if (this.dataForm.valid) {
            const postData = new AgendaConfidentialModel(this.dataForm.getRawValue());
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
