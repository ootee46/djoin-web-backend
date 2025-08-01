import {
    Component,
    Input,
    OnInit,
    Output,
    EventEmitter,
    ViewChild,
    ElementRef,
    forwardRef,
} from '@angular/core';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import {
    ControlValueAccessor,
    NG_VALUE_ACCESSOR,
    NG_VALIDATORS,
    UntypedFormControl,
    Validator,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { AttachmentModel } from 'app/models/attachment.model';
import { FileInputService } from './file-input.service';
@Component({
    selector: 'file-input',
    templateUrl: 'file-input.component.html',
    styleUrls: ['file-input.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FileInputComponent),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: FileInputComponent,
            multi: true,
        },
    ],
})
export class FileInputComponent implements ControlValueAccessor, OnInit {

    @ViewChild('myFile', { static: false }) myFile: ElementRef;
    @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

    @Input() displayText: string;
    @Input() testMode: boolean;
    @Input() acceptFile: string;
    @Input() limitSize: number;
    @Input() resetFileName: boolean;
    @Input() oldData: AttachmentModel;
    @Input() showAddButton: boolean = false;
    @Output() uploadCompleted: EventEmitter<AttachmentModel> = new EventEmitter<AttachmentModel>();
    @Output() removed: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() uploadError: EventEmitter<string> = new EventEmitter<string>();

    public fileName: string = '';
    public uploadProgress: number = 0;
    public _required: any = false;
    public value: AttachmentModel = null;
    public selectedFile: File = null;
    public startUpload = false;
    public color = 'warn';
    public mode = 'Indeterminate';
    public bufferValue = 0;
    public outputFile: AttachmentModel = null;
    private _acceptFileArray: string[] = [];
    private _selectedFile: File = null;
    private onChanged = [];
    private onTouched = [];
    constructor(private _service: FileInputService) {

    }


    // eslint-disable-next-line @typescript-eslint/member-ordering
    get required(): boolean {
        return this._required;
    }
    @Input()
    set required(value: boolean) {
        this._required = this.coerceBooleanProperty(value);
    }


    @Input() set oldFileName(value: string) {
        if (value) {
            this.fileName = value;
        }
    }


    ngOnInit(): void {
        if (!this.resetFileName) {
            this.resetFileName = false;
        }
        if (this.acceptFile) {
            this.acceptFile = this.acceptFile.trim().toLowerCase();
            this._acceptFileArray = this.acceptFile.split(',');
            this._acceptFileArray.forEach((c) => {
                c = c.trim();
            });
        }
        if(this.oldData){
            this.fileName = this.oldData.fileName;
        }
    }

    setOldData(oldData: AttachmentModel): void{
        this.oldData = oldData;
    }

    clearOutput(): void{
        this.fileName = null;
        this.oldData = null;
    }
    openFile(): void {
        this.myFile.nativeElement.click();
    }
    coerceBooleanProperty(value: any): boolean {
        return value != null && `${value}` !== 'false';
    }
    addAttachment(): void{

    }

    validate({ value }: UntypedFormControl): boolean {
        if (this._required && this.fileName === '') {
            return false;
        } else {
            return true;
        }
    }
    writeValue(value: AttachmentModel): void {
        if(value){
            this.fileName = value.fileName;
            this.oldData = value;
        }else{
            this.fileName = null;
            this.oldData = null;
            this.selectedFile = null;
            this.reset();
        }

    }
    propagateChange = (_: any): void => { };

    registerOnChange(fn:  (v: AttachmentModel) => void): void {
        this.onChanged.push(fn);
    }
    registerOnTouched(fn: () => void): void {
        this.onTouched.push(fn);
    }

    onFileSelected(myEvent: any): void {
        this._selectedFile = myEvent.target.files[0] as File;
        if(this.limitSize != null && this._selectedFile.size > (this.limitSize * (1024*1024)))
        {
            this.startUpload = false;
            Swal.fire('','File size exceeds allowed limit of  ' + this.limitSize + 'MB.');
            this.fileName = null;
            this.myFile.nativeElement.value = '';
            return;
        }
        if(this._acceptFileArray && Array.isArray(this._acceptFileArray) && this._acceptFileArray.length > 0){
            const fileExtension = '.' + this._selectedFile.name.trim().toLowerCase().split('.').pop();
            const checkFileExtension = this._acceptFileArray.find(c=>c === fileExtension);
            if(checkFileExtension == null){
                this.startUpload = false;
                Swal.fire('','File extension '  + fileExtension + ' is not allowed.');
                this.fileName = null;
                this.myFile.nativeElement.value = '';
                return;
            }
        }
        this.startUpload = true;
        this.uploadProgress = 0;
        this._service.uploadFile(this._selectedFile).subscribe((event: HttpEvent<AttachmentModel>) => {
            if (event.type === HttpEventType.UploadProgress) {
                this.uploadProgress = Math.round(event.loaded / event.total * 100);
            } else if (event.type === HttpEventType.Response) {
                this.startUpload = false;
                this.fileName = event.body.fileName;
                this.oldData = event.body;

                const returnData =  new AttachmentModel(event.body);
                returnData.isNew = true;
                this.onChanged.forEach(fn => fn(returnData));
                this.value = returnData;
                this.uploadCompleted.emit(returnData );
            }
        });
    }

    deleteAttachment(): void {
        Swal.fire({
            title: '',
            text: 'Do you want to delete this item?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                this.reset();
                this.fileName = '';
                this.oldData = null;
                this.onChanged.forEach(fn => fn(null));
                this.selectedFile = null;
                if (this.oldData) {
                    this.oldData = null;
                }
                this.removed.emit(true);
            }
        });
    }
    reset(): void {
        if(this.myFile){
            this.myFile.nativeElement.value = '';
        }

    }
    removeFile(): void {
        this.reset();
        this.fileName = '';
        this.selectedFile = null;
        this.removed.emit(true);
    }
}
