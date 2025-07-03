/* eslint-disable @typescript-eslint/member-ordering */
import { Component, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, UntypedFormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AttachmentModel } from 'app/models/attachment.model';
import { InputFormData } from 'app/models/input-form-data';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { AttachmentFormComponent } from './form/form.component';

@Component({
    selector: 'attachment',
    templateUrl: './attachment.component.html',
    styles:['.grid-attachment { grid-template-columns: 90px 200px  auto 90px 120px;}'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AttachmentComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: AttachmentComponent,
            multi: true
        }
    ]
})
export class AttachmentComponent implements OnInit, OnDestroy, ControlValueAccessor {

    @Input() oldDatas: AttachmentModel[];
    @Output() dataChanged: EventEmitter<AttachmentModel[]> = new EventEmitter<AttachmentModel[]>();
    public datas: BehaviorSubject<AttachmentModel[]> = new BehaviorSubject([]);
    private _formPopup: MatDialogRef<AttachmentFormComponent>;
    private _unsubscribeAll: Subject<any> = new Subject();
    private _datas: AttachmentModel[] = [];


    constructor(
        private _matDialog: MatDialog,
    ) { }


    ngOnInit(): void {
        this.datas.pipe(takeUntil(this._unsubscribeAll)).subscribe((resp: AttachmentModel[])=>{
            this._datas = resp;
            this.dataChanged.emit(this._datas);
        });
        if(this.oldDatas && this.oldDatas.length > 0){
            this.datas.next(this.oldDatas);
        }
    }

    formatBytes(bytes, decimals = 2): string {
        if (bytes === 0) {return '0 Bytes';};
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }


    create(): void {
        const inputData: InputFormData<AttachmentModel> = new InputFormData<AttachmentModel>();
        inputData.data = new AttachmentModel({});
        inputData.action = 'add';
        this.openForm(inputData);
    }
    edit(rowData: AttachmentModel): void {
        const inputData: InputFormData<AttachmentModel> = new InputFormData<AttachmentModel>();
        inputData.data = rowData;
        inputData.action = 'edit';

        this.openForm(inputData);
    }
    deleteData(rowData: AttachmentModel): void{
        Swal.fire({
            title: '',
            text: 'Do you want to delete this item?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if(result.isConfirmed){
               let tempDatas = this.datas.getValue();
               tempDatas = tempDatas.filter(c=>c !== rowData);
               this.datas.next(tempDatas);
            }
        });
    }

    openForm(input: InputFormData<AttachmentModel>): void {
        this._formPopup = this._matDialog.open(AttachmentFormComponent, {
            panelClass: 'standard-dialog',
            width: '80%',
            data: input
        });
        this._formPopup.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe((resp: AttachmentModel) => {
            if(input.action === 'edit')
            {

                if(resp && resp.fileName != null){
                    const obj = this._datas.findIndex(c=>c === input.data);
                    if(obj > -1){
                        this._datas[obj] = resp;
                        this.datas.next(this._datas);
                    }
                }
            }
            else if(input.action === 'add')
            {
                if(resp && resp.fileName != null){
                    this._datas.push(resp);
                    this.datas.next(this._datas);
                }
            }
        });
    }

    onChanged: any = () => { };
    onTouched: any = () => { };
    propagateChange: any = (_: any) => { };
    registerOnChange(fn: any): void {
        this.onChanged = fn;
    }
    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }
    writeValue(value: AttachmentModel[]): void {
      this.datas.next(value);
    }
    validate({ value }: UntypedFormControl): boolean {
        return true;
    }


    loadData(): void{

    }
    saveData(): void{

    }




    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}
