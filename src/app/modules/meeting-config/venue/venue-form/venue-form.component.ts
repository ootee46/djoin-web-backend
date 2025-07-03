import { Component, OnInit, ViewEncapsulation, Inject, OnDestroy, ViewChild, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { InputFormData } from 'app/models/input-form-data';
import { Subject, take, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { StandardModel, StandardFormModel } from 'app/models/standard.model';
import { VenueService } from '../venue.service';
import { CustomValidator } from 'app/validators/custom.validate';

@Component({
  selector: 'venueform',
  templateUrl: './venue-form.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class VenueFormComponent implements OnInit, OnDestroy {
  @ViewChild('myForm') myForm: NgForm;
  action: string;
  dialogTitle: string;
  data: StandardModel;
  dataForm: FormGroup;
  kw: string;
  private _unsubscribeAll: Subject<any> = new Subject();
  constructor(
    private _matDialogRef: MatDialogRef<VenueFormComponent>,
    @Inject(MAT_DIALOG_DATA) private input: InputFormData<StandardModel>,
    private _matDialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _service: VenueService
  ) { }

  ngOnInit(): void {
    this.kw = null;
    this.action = this.input.action;
    this.dialogTitle = (this.action === 'add' ? 'New' : 'Update');
    this.data = this.input.data;
    this.dataForm = this.createDataForm();
  }
  createDataForm(): FormGroup {
    return this._formBuilder.group({
      'id': [this.data.id || 0 ,[Validators.required]],
      'name': [this.data.name, [Validators.required,CustomValidator.whiteSpace, Validators.maxLength(90)]],
      'active': [this.data.active, [Validators.required]]
    });
  }
  saveData(): void {
    if (this.dataForm.valid) {
      const postData = new StandardFormModel(this.dataForm.getRawValue());
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
                this.dataForm.enable();
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
                this.dataForm.enable();
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
