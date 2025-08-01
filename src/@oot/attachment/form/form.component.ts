import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation, Inject, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ENDPOINT } from 'app/constants/endpoint';
import { AttachmentModel } from 'app/models/attachment.model';
import { FileDescModel } from 'app/models/file-desc.model';
import { InputFormData } from 'app/models/input-form-data';
import { StandardModel } from 'app/models/standard.model';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { AttachmentService } from '../attachment.service';

@Component({
    selector: 'attachment-form',
    templateUrl: './form.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AttachmentFormComponent implements OnInit, OnDestroy {
    @ViewChild('myForm') myForm: NgForm;
    @ViewChild('myFile', { static: false }) myFile: ElementRef;
    action: string;
    dialogTitle: string;
    data: AttachmentModel;
    dataForm: UntypedFormGroup;
    acceptFile: string;
    uploadProgress: number = 0;
    startUpload: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject();
    private _selectedFile: File = null;
    constructor(
        private _matDialogRef: MatDialogRef<AttachmentFormComponent>,
        @Inject(MAT_DIALOG_DATA) private input: InputFormData<AttachmentModel>,
        private _formBuilder: UntypedFormBuilder,
        private _service: AttachmentService
    ) { }

    ngOnInit(): void {
        this.action = this.input.action;
        this.dialogTitle = (this.action === 'add' ? 'New' : 'Update');
        this.data = this.input.data;
        this.dataForm = this.createDataForm();
    }
    createDataForm(): UntypedFormGroup {
        return this._formBuilder.group({
            'id':[this.data.id],
            'title':[this.data.title,[Validators.maxLength(100)]],
            'fileName':[this.data.fileName],
            'realFileName':[this.data.realFileName],
            'fileSize':[this.data.fileSize],
            'fileType':[this.data.fileType],
            'fileUrl':[this.data.fileUrl],
            'updatedDate':[this.data.updatedDate],
        });
    }
    close(): void{
        this._matDialogRef.close();
    }
    openFile(): void{
        this.myFile.nativeElement.click();
    }
    onFileSelected(myEvent: any): void{
        this._selectedFile = myEvent.target.files[0] as File;
        this.startUpload = true;
        this.uploadProgress = 0;
        this._service.uploadFile(this._selectedFile).subscribe((event: HttpEvent<AttachmentModel>)=>{
            if (event.type === HttpEventType.UploadProgress) {
                this.uploadProgress = Math.round(event.loaded / event.total * 100);
            } else if (event.type === HttpEventType.Response) {
                this.startUpload = false;
                this.dataForm.get('id').patchValue(event.body.id);
                this.dataForm.get('fileName').patchValue(event.body.fileName);
                this.dataForm.get('realFileName').patchValue(event.body.realFileName);
                this.dataForm.get('fileSize').patchValue(event.body.fileSize);
                this.dataForm.get('fileType').patchValue(event.body.fileType);
                this.dataForm.get('fileUrl').patchValue(event.body.fileUrl);
                this.dataForm.get('updatedDate').patchValue(event.body.updatedDate);
            }
        });
    }
    saveData(): void{
        const fileDesc = new FileDescModel({});
        const postValue = this.dataForm.getRawValue();
        fileDesc.id = postValue.id;
        fileDesc.title = postValue.title;
        this._service.updateDesc(fileDesc).pipe(takeUntil(this._unsubscribeAll)).subscribe(()=>{
            this._matDialogRef.close(postValue);
        });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}
