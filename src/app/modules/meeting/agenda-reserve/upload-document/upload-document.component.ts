import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { FileInputComponent } from '@oot/file-input/file-input.component';
import {
    AgendaRequestAttachmentFormModel,
    AgendaRequestAttachmentModel,
    AgendaRequestAttachmentPermissionModel,
    AgendaRequestItemModel,
} from 'app/models/agenda-request.model';
import { AttachmentModel } from 'app/models/attachment.model';
import { MeetingAttendeeModel } from 'app/models/attendee.model';
import { InputFormData } from 'app/models/input-form-data';
import { StandardModel } from 'app/models/standard.model';
import { UserModel } from 'app/models/user.model';
import { concatMap, Observable, of, Subject, take, takeLast, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { AgendaReserveService } from '../agenda-reserve.service';
import { DocumentPermissionComponent } from './document-permission/permission.component';
import { UploadDocumentService } from './upload-document.service';

@Component({
    selector: 'app-upload-document',
    templateUrl: './upload-document.component.html'
})
export class UploadDocumentComponent implements OnInit, OnDestroy {
    @ViewChild('presenterAttachmentInput') presenterAttachmentInput: FileInputComponent;
    @ViewChild('attachmentInput') attachmentInput: FileInputComponent;
    @Input() data$: Observable<AgendaRequestItemModel>;
    @Input() users$: Observable<UserModel[]>;
    @Input() documentTypes$: Observable<StandardModel[]>;
    data: AgendaRequestItemModel;
    presenterAttachment: AttachmentModel = null;
    attendees: MeetingAttendeeModel[] = [];
    attachment: AttachmentModel = null;
    attachmentsRememberSort: AgendaRequestAttachmentModel[] = [];
    selectAttachments: AgendaRequestAttachmentModel[] = [];
    documentTypeId: number = null;
    isAllCheck: boolean;
    id: string;
    sortAttachments: {
        fieldName: string,
        sort: 'asc' | 'desc' | 'none'
    }
    sortPresenters: {
        fieldName: string,
        sort: 'asc' | 'desc'
    }
    private _formPopup: MatDialogRef<DocumentPermissionComponent>;
    private _unsubscribeAll: Subject<any> = new Subject();
    constructor(
        private _service: UploadDocumentService,
        private _agendaReserveService: AgendaReserveService,
        private _route: ActivatedRoute,
        private _matDialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.id = this._route.snapshot.paramMap.get('id');
        this.data$.pipe(takeUntil(this._unsubscribeAll)).subscribe((value) => {
            this.data = value;
             this.attachmentsRememberSort = this.attachmentsRememberSort.length > 0 ? this.attachmentsRememberSort : this.data.attachments
            // if(this.attendees){
            //     this.processPermission();
            // }
        });
        this.sortAttachments = {
            fieldName: 'fileName',
            sort: 'none'
        }
        this.sortPresenters = {
            fieldName: 'fileName',
            sort: 'asc'
        }
        this._agendaReserveService.attendees$.pipe(takeUntil(this._unsubscribeAll)).subscribe((value) => {
            if(value){
                this.attendees = value;
                this.processPermission();
            }

        });
    }
    addPresenterAttachment(id: number): void {
        if (this.presenterAttachment && id) {
            const checkExist = this.data.presenterAttachments.find(c => c.fileName === this.presenterAttachment.fileName);
            if (checkExist) {
                Swal.fire('', 'This file already exists.');
                return;
            }

            const obj = new AgendaRequestAttachmentFormModel({});
            obj.uid = this.presenterAttachment.uid;
            obj.agendaRequestItemId = this.data.id;
            obj.attachmentType = 'presenter';
            // obj.attachmentId = this.presenterAttachment.id;
            this._service.add(obj).pipe(take(1)).subscribe(() => {
                this._agendaReserveService.getData(this.id)
                    .pipe(take(1)).subscribe(() => {
                        this.presenterAttachment = null;
                        if(this.presenterAttachmentInput){
                            this.presenterAttachmentInput.clearOutput();
                        }
                    });
            });
        }
    }

    addAttachment(id: number): void {
        if (this.attachment && id && this.documentTypeId) {

            const checkExist = this.data.attachments.find(c => c.fileName === this.attachment.fileName && c.documentTypeId === this.documentTypeId);
            if (checkExist) {
                Swal.fire('', 'This file already exists.');
                return;
            }

            const obj = new AgendaRequestAttachmentFormModel({});
            obj.uid = this.attachment.uid;
            obj.agendaRequestItemId = this.data.id;
            obj.documentTypeId = this.documentTypeId;
            obj.attachmentType = 'attachment';
            // obj.attachmentId = this.attachment.id;
            this._service.add(obj).pipe(take(1)).subscribe(() => {
                this._agendaReserveService.getData(this.id)
                    .pipe(take(1)).subscribe(() => {
                        this.attachment = null;
                        this.documentTypeId = null;
                        if(this.attachmentInput){
                            this.attachmentInput.clearOutput();
                        }
                    });
            });
        }
    }

    setAttachmentsSort(key: string): void {
        if (key === this.sortAttachments.fieldName) {
            if (this.sortAttachments.sort === 'asc') {
                this.sortAttachments.sort = 'desc';
            } else if (this.sortAttachments.sort === 'desc') {
                this.sortAttachments.sort = 'none';
            } else {
                this.sortAttachments.sort = 'asc';
            }
        } else {
            this.sortAttachments.fieldName = key;
            this.sortAttachments.sort = 'asc';
        }
        const dataSort = this.sortArrayByFieldDragDrop(this.data.attachments,this.sortAttachments.fieldName,this.sortAttachments.sort)

        const obj = dataSort.map((item, index) => {
            const obj = new AgendaRequestAttachmentFormModel({});
            obj.attachmentId = null;
            obj.pos = index + 1;
            obj.id = item.id;
            return obj;
        });

            this._service.posBatch(obj).subscribe({
                next: () => {
                    this._agendaReserveService.getData(this.id).pipe(take(1)).subscribe();
                }
            });
    }

    sortArrayByFieldDragDrop(array: AgendaRequestAttachmentModel[], fieldName: string, sort: string): AgendaRequestAttachmentModel[] {
        const list = [...array]
        if (sort === 'none') {
            return this.attachmentsRememberSort; // No sorting applied
        }

        const dataSort = list.sort((a, b) => {
            // Handle undefined or null fields gracefully
            const fieldA = a[fieldName] ?? '';
            const fieldB = b[fieldName] ?? '';

            // Determine comparison based on order
            if (sort === 'asc') {
                return fieldA > fieldB ? 1 : fieldA < fieldB ? -1 : 0;
            } else {
                return fieldA < fieldB ? 1 : fieldA > fieldB ? -1 : 0;
            }
        });
        return dataSort
    }

    setPresentersSort(key: string): void {
        if (key === this.sortPresenters.fieldName) {
            this.sortPresenters.sort = this.sortPresenters.sort === 'asc' ? 'desc' : 'asc'
        } else {
            this.sortPresenters.fieldName = key
            this.sortPresenters.sort = 'asc'
        }

    }

    sortArrayByField(array: AgendaRequestAttachmentModel[] | AgendaRequestAttachmentModel[], fieldName: string, sort: string): AgendaRequestAttachmentModel[] {

        return array.sort((a, b) => {
            // Handle undefined or null fields gracefully
            const fieldA = a[fieldName] ?? '';
            const fieldB = b[fieldName] ?? '';

            // Determine comparison based on order
            if (sort === 'asc') {
                return fieldA > fieldB ? 1 : fieldA < fieldB ? -1 : 0;
            } else {
                return fieldA < fieldB ? 1 : fieldA > fieldB ? -1 : 0;
            }
        });
    }

    deleteAttachment(id: number): void {
        this.sortAttachments.sort = 'none'
        Swal.fire({
            title: '',
            text: 'Do you want to delete this item?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                this._service.delete(id).pipe(take(1)).subscribe({
                    next: () => {
                        Swal.fire('', 'Data has been deleted.').then(() => {
                            this._agendaReserveService.getData(this.id).pipe(take(1)).subscribe();
                        });
                    }
                });
            }
        });
    }

    isAttachmentCheck(id: number): boolean {
        return this.selectAttachments.find(c => c.id === id) != null;
    }
    checkAttachment(event: MatCheckboxChange, value: AgendaRequestAttachmentModel): void {
        this.isAllCheck = false;
        if (event.checked) {
            if (this.selectAttachments.find(c => c.id === value.id) == null) {
                this.selectAttachments.push(value);
            }
        }
        else {
            this.selectAttachments = this.selectAttachments.filter((c: any) => c.id !== value.id);
        }

    }

    toggleAllAttachment(event: MatCheckboxChange): void {
        if (event.checked) {
            this.selectAttachments = this.data.attachments;
        } else {
            this.selectAttachments = [];
        }
    }

    multipleDeleteAttachment(): void {
        if (this.data.id && this.selectAttachments && this.selectAttachments.length > 0) {
            Swal.fire({
                title: '',
                text: 'Do you want to delete this item?',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
            }).then((result) => {
                if (result.isConfirmed) {
                    const requestDatas: any = [];
                    this.selectAttachments.forEach((item) => {
                        requestDatas.push(this._service.delete(item.id));
                    });
                    requestDatas.push(this._agendaReserveService.getData(this.id));
                    of(...requestDatas)
                    .pipe(
                      concatMap((req: Observable<any>) => req),
                      takeLast(1)
                    )
                    .subscribe((response) => {
                        this.isAllCheck = false;
                        this.selectAttachments = [];
                        Swal.fire('', 'Datas has been deleted.').then(() => { });
                    });
                }
            });
        }
    }

    attachmentDrop(event: CdkDragDrop<any>): void {
        this.sortAttachments.sort = 'none'
        moveItemInArray(event.container.data.attachments, event.previousIndex, event.currentIndex);
        if (event.item && event.item.data && event.currentIndex >= 0) {
            const obj = new AgendaRequestAttachmentFormModel({});
            obj.attachmentId = event.item.data.attachmentId;
            obj.pos = event.currentIndex + 1;
            obj.id = event.item.data.id;
            this._service.pos(obj).subscribe({
                next: () => {
                    this._agendaReserveService.getData(this.id).pipe(take(1)).subscribe();
                }
            });
        }
    }

    move(attachment: AgendaRequestAttachmentModel, previousIndex: number, currentIndex: number): void {
        this.sortAttachments.sort = 'none'
        moveItemInArray(this.data.attachments, previousIndex, currentIndex);
        if (attachment && currentIndex >= 0) {
            const obj = new AgendaRequestAttachmentFormModel({});
            obj.attachmentId = null;
            obj.pos = currentIndex + 1;
            obj.id = attachment.id;
            this._service.pos(obj).subscribe({
                next: () => {
                    this._agendaReserveService.getData(this.id).pipe(take(1)).subscribe();
                }
            });
        }
    }

    drop(event: any): void {
        this.sortAttachments.sort = 'none'
        moveItemInArray(this.data.attachments, event.previousIndex, event.currentIndex);
    }
    openPermission(value: AgendaRequestAttachmentModel[]): void {
        this.sortAttachments.sort = 'none'
        if (value && value.length > 0) {
            const inputData: InputFormData<AgendaRequestAttachmentModel[]> = new InputFormData<AgendaRequestAttachmentModel[]>();
            inputData.data = value;
            inputData.action = 'add';
            this._formPopup = this._matDialog.open(DocumentPermissionComponent, {
                panelClass: 'standard-dialog',
                data: inputData
            });

            this._formPopup.afterClosed().pipe(take(1)).subscribe(() => {
                this._agendaReserveService.getData(this.id).pipe(take(1)).subscribe();
                this.isAllCheck = false;
                this.selectAttachments = [];
            });
        }

    }

    processPermission(): void {
        this.data.attachments.forEach((item) => {
            this.processItemPermission(item);
        });
    }
    processItemPermission(value: AgendaRequestAttachmentModel): void {
        let notAssignPermissions = this.attendees;
        if (value.permissions.length > 0) {
            notAssignPermissions = this.attendees.filter(c => value.permissions.find(a => a.userId !== c.id));
        }
        else{
            notAssignPermissions.forEach((item) => {
                const obj = new AgendaRequestAttachmentPermissionModel({});
                obj.id = 0;
                obj.attachmentId = value.id;
                obj.userId = item.id;
                obj.isRead = true;
                obj.isDownload = true;
                obj.name = item.name;
                value.permissions.push(obj);
            });
        }
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}
