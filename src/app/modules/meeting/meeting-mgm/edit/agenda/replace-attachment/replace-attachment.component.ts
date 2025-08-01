import { Component, OnInit, ViewEncapsulation, Inject, OnDestroy, ViewChild, AfterContentChecked } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { AttachmentModel, MeetingAttachmentModel } from 'app/models/attachment.model';
import { InputFormData } from 'app/models/input-form-data';
import { ReplaceAttachmentFormModel } from 'app/models/replace-attachment.model';
import { StandardModel } from 'app/models/standard.model';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { MeetingMgmService } from '../../../meeting-mgm.service';
import { AgendaService } from '../agenda.service';

@Component({
    selector: 'replace-attachment-form',
    templateUrl: './replace-attachment.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ReplaceAttachmentFormComponent implements OnInit, OnDestroy {
    @ViewChild('myForm') myForm: NgForm;
    action: string;
    dialogTitle: string;
    data: MeetingAttachmentModel;
    dataForm: UntypedFormGroup;
    kw: string;
    attachment: AttachmentModel = null;
    documentTypes$: Observable<StandardModel[]>;
    documentTypeId: StandardModel;
    private _unsubscribeAll: Subject<any> = new Subject();
    constructor(
        private _matDialogRef: MatDialogRef<ReplaceAttachmentFormComponent>,
        @Inject(MAT_DIALOG_DATA) private input: InputFormData<MeetingAttachmentModel>,
        private _matDialog: MatDialog,
        private _meetingService: MeetingMgmService,
        private _service: AgendaService,
        private _splash: FuseSplashScreenService,
        private _formBuilder: UntypedFormBuilder
    ) { }

    ngOnInit(): void {
      this.documentTypes$ = this._meetingService.documentTypes$;
        this.action = this.input.action;
        this.data = this.input.data;
        this.dataForm = this.createDataForm();
    }
    createDataForm(): UntypedFormGroup {
        return this._formBuilder.group({
            'id': [this.data.id || 0 ,[Validators.required]],
            'realFileName': [this.data.realFileName],
            'agendaId': [this.data.agendaId],
            'documentTypeId': [this.data.documentTypeId]
        });
    }
    saveData(): void {
        if (this.dataForm.valid) {
            const rawData = this.dataForm.getRawValue();
            const postData = new ReplaceAttachmentFormModel();
            postData.documentTypeId = rawData.documentTypeId;
            postData.id = this.data.id;
            if(this.action === 'replace'){
              postData.isAnnotation = false;
            }else{
              postData.isAnnotation = true;
            }
            if(this.attachment){
              postData.newAttachmentId = this.attachment.id;
            }else{
              postData.newAttachmentId = this.data.id;
            }
            postData.agendaId = this.data.agendaId;
            Swal.fire({
              title: '',
              text: 'Do you want to save your changes ?',
              showCancelButton: true,
              confirmButtonText: 'Save',
              cancelButtonText: 'Cancel'
          }).then((result) => {
            if(result.isConfirmed){
              this.dataForm.disable();
              this._splash.show();
              this._service.replaceFile(postData).pipe(take(1)).subscribe({
                  next: (resp: any) => {
                        this._splash.hide();
                      Swal.fire('', 'Data has been saved.').then(() => {
                          this.dataForm.enable();
                          this._matDialogRef.close((this.attachment?this.attachment: new AttachmentModel(this.data)));
                      });
                  },
                  error: () => {
                      this._splash.hide();
                      this.dataForm.enable();
                  }
              });
            }
          });
            // const postData = new AgendaConfidentialModel(this.dataForm.getRawValue());
            // Swal.fire({
            //     title: 'Confirm ?',
            //     text: 'Save Confirmation!',
            //     icon: 'warning',
            //     showCancelButton: true,
            //     confirmButtonText: 'Confirm',
            //     cancelButtonText: 'Cancel'
            // }).then((result) => {
            //     if (result.isConfirmed) {
            //         this.dataForm.disable();
            //         if (this.action === 'edit') {
            //             this._service.update(postData).pipe(takeUntil(this._unsubscribeAll)).subscribe({
            //                 next: (resp: any) => {
            //                     Swal.fire('', 'Data has been saved.').then(() => {
            //                         this.dataForm.enable();
            //                         this._matDialogRef.close(resp);
            //                     });
            //                 },
            //                 error: () => {
            //                     this.dataForm.enable();
            //                 }
            //             });
            //         }
            //         else {
            //             this._service.create(postData).pipe(takeUntil(this._unsubscribeAll)).subscribe({
            //                 next: (resp: any) => {
            //                     Swal.fire('', 'Data has been saved.').then(() => {
            //                         this.dataForm.enable();
            //                         this._matDialogRef.close(resp);
            //                     });
            //                 },
            //                 error: () => {
            //                     this.dataForm.enable();
            //                 }
            //             });
            //         }
            //     }
            // });
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
