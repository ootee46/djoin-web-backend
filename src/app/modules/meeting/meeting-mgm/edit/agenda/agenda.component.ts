/* eslint-disable max-len */
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { PlatformLocation } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { InputFormData } from 'app/models/input-form-data';
import { MeetingAgendaModel } from 'app/models/meeting-agenda.model';
import { MeetingModel } from 'app/models/meeting.model';
import { QueryListModel } from 'app/models/query-list.model';
import { Buffer } from 'buffer';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';
import * as moment from 'moment';
import { Subject, take, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { SplitArrayToExcelLineWithNumber } from 'app/helpers/util';
import { AgendumExportModel } from 'app/models/agendum-export.mode';
import { MeetingMgmService } from '../../meeting-mgm.service';
import { AgendaService } from './agenda.service';
import { MeetingAgendaFormComponent } from './form/form.component';
import { MeetingAgendaForm2Component } from './form2/form2.component';

@Component({
    selector: 'meeting-agenda',
    templateUrl: './agenda.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AgendaComponent implements OnInit, OnDestroy {

    datas: MeetingAgendaModel[] = null;
    plainDatas: MeetingAgendaModel[] = [];              
    meeting: MeetingModel = null;
    id: number;
    bgSteps = ['bg-sky-200', 'bg-sky-100', 'bg-gray-50', 'bg-white', 'bg-white', 'bg-white', 'bg-white', 'bg-white', 'bg-white', 'bg-gray-100'];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private _query = new QueryListModel({});
    private meetingId: number;
    private _formPopup: MatDialogRef<MeetingAgendaFormComponent>;
    private _formPopup2: MatDialogRef<MeetingAgendaForm2Component>;
    private _baseHref: string = '';
    constructor(
        private _service: AgendaService,
        private _matDialog: MatDialog,
        private _route: ActivatedRoute,
        private _splash: FuseSplashScreenService,
        private _router: Router,
        private _meetingService: MeetingMgmService,
        private _platformLocation: PlatformLocation,
        private _http: HttpClient,
    ) { }

    ngOnInit(): void {
        this._baseHref = this._platformLocation.getBaseHrefFromDOM();
        this.meetingId = parseInt(this._route.snapshot.paramMap.get('id'), 10);
        if (this.meetingId) {
            this._query.catId = this.meetingId;
            this._service.listData$.pipe(takeUntil(this._unsubscribeAll)).subscribe((values) => {
                if (values) {
                    this.datas = values;
                    if (this.datas && Array.isArray(this.datas) && this.datas.length > 0) {
                        this.plainDatas = [];
                        this.createPlainData(this.datas, 0);
                    }
                } else {
                    this.datas = [];
                }
            });
        }

        this._meetingService.data$.pipe(takeUntil(this._unsubscribeAll)).subscribe((value) => {
            this.meeting = value;
        });
    }


    loadData(): void {
        this._service.getDatas(this._query).pipe(take(1)).subscribe();
    }

    createPlainData(values: MeetingAgendaModel[], level: number): void {

        values.forEach((item) => {
            item.level = level;
            this.plainDatas.push(item);
            if (item.subAgendas != null && Array.isArray(item.subAgendas) && item.subAgendas.length > 0) {
                this.createPlainData(item.subAgendas, (level + 1));
            }
        });
    }
    create(): void {
        const inputData: InputFormData<MeetingAgendaModel> = new InputFormData<MeetingAgendaModel>();
        inputData.data = new MeetingAgendaModel({});
        inputData.data.meetingId = this.meetingId;
        inputData.action = 'add';
        this._formPopup = this._matDialog.open(MeetingAgendaFormComponent, {
            panelClass: 'full-dialog',
            width: '100%',
            data: inputData
        });
        this._formPopup.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
            this.loadData();
        });
    }

    export(): void {
        this._service.agendumExport(this.meetingId).pipe(take(1)).subscribe((value: AgendumExportModel) => {
            if (!value || !value.items || value.items.length === 0) {
                Swal.fire('', 'No data to export.', 'warning');
                return;
            }

            const wb = new ExcelJS.Workbook();
            const reader = new FileReader();
            this._http.get(this._baseHref + 'assets/templates/agendum.xlsx', { responseType: 'blob' }).pipe(take(1))
                .subscribe((excelTemplate) => {
                    reader.readAsArrayBuffer(excelTemplate);
                    reader.onload = (): void => {
                        const buffer: ArrayBuffer = reader.result as ArrayBuffer;
                        const excelData = new Uint8Array(buffer);
                        let indexStart = 8;
                        wb.xlsx.load(Buffer.from(excelData)).then((workbook) => {
                            const worksheet = workbook.getWorksheet(1);
                            worksheet.getCell('B2').value = this.meeting.meetingNo;
                            worksheet.getCell('B3').value = this.meeting.title;
                            worksheet.getCell('B4').value = moment(this.meeting.startDate).format('DD/MM/YYYY') + ' ' + moment(this.meeting.startDate).format('HH:mm') + '-' + moment(this.meeting.endDate).format('HH:mm');
                            value.items.forEach((item, index) => {
                                worksheet.getCell('A' + (indexStart)).value = item.agendaNo;
                                worksheet.getCell('B' + (indexStart)).value = this.generateSplace(item.level) + item.title;
                                worksheet.getCell('C' + (indexStart)).value = item.objective;
                                worksheet.getCell('D' + (indexStart)).value = item.confidentialLevel;
                                worksheet.getCell('E' + (indexStart)).value = item.owner;
                                worksheet.getCell('F' + (indexStart)).value = SplitArrayToExcelLineWithNumber(item.agendaTeams);
                                worksheet.getCell('F' + (indexStart)).alignment = { wrapText: true, vertical: 'middle' };
                                worksheet.getCell('G' + (indexStart)).value = SplitArrayToExcelLineWithNumber(item.presenters);
                                worksheet.getCell('G' + (indexStart)).alignment = { wrapText: true, vertical: 'middle' };
                                worksheet.getCell('H' + (indexStart)).value = moment(item.bookingDate).format('DD/MM/YYYY');
                                worksheet.getCell('I' + (indexStart)).value = moment(item.bookingDate).format('HH:mm');
                                worksheet.getCell('J' + (indexStart)).value = SplitArrayToExcelLineWithNumber(item.presenterAttachments);
                                worksheet.getCell('J' + (indexStart)).alignment = { wrapText: true, vertical: 'middle' };
                                worksheet.getCell('K' + (indexStart)).value = SplitArrayToExcelLineWithNumber(item.attachments);
                                worksheet.getCell('K' + (indexStart)).alignment = { wrapText: true, vertical: 'middle' };

                                // merge row if approvers > 1
                                if (item.approvers.length > 1) {
                                    worksheet.mergeCells('A' + (indexStart) + ':A' + (indexStart + item.approvers.length - 1));
                                    worksheet.mergeCells('B' + (indexStart) + ':B' + (indexStart + item.approvers.length - 1));
                                    worksheet.mergeCells('C' + (indexStart) + ':C' + (indexStart + item.approvers.length - 1));
                                    worksheet.mergeCells('D' + (indexStart) + ':D' + (indexStart + item.approvers.length - 1));
                                    worksheet.mergeCells('E' + (indexStart) + ':E' + (indexStart + item.approvers.length - 1));
                                    worksheet.mergeCells('F' + (indexStart) + ':F' + (indexStart + item.approvers.length - 1));
                                    worksheet.mergeCells('G' + (indexStart) + ':G' + (indexStart + item.approvers.length - 1));
                                    worksheet.mergeCells('H' + (indexStart) + ':H' + (indexStart + item.approvers.length - 1));
                                    worksheet.mergeCells('I' + (indexStart) + ':I' + (indexStart + item.approvers.length - 1));
                                    worksheet.mergeCells('J' + (indexStart) + ':J' + (indexStart + item.approvers.length - 1));
                                    worksheet.mergeCells('K' + (indexStart) + ':K' + (indexStart + item.approvers.length - 1));
                                }

                                //loop approver
                                item.approvers.forEach((approver) => {
                                    worksheet.getCell('L' + (indexStart)).value = approver.description;
                                    worksheet.getCell('M' + (indexStart)).value = approver.name;
                                    worksheet.getCell('N' + (indexStart)).value = approver.status;
                                    worksheet.getCell('O' + (indexStart)).value = moment(approver.approveDate).format('DD/MM/YYYY');
                                    worksheet.getCell('P' + (indexStart)).value = moment(approver.approveDate).format('HH:mm');
                                    //check if not last approver
                                    if (item.approvers.indexOf(approver) < (item.approvers.length - 1)) {
                                        indexStart++;
                                    }
                                });



                                indexStart++;

                            });
                            workbook.xlsx.writeBuffer().then((data) => {
                                const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                                FileSaver.saveAs(blob, 'agendum-' + moment().format('YYYY-MM-DD') + '.xlsx');
                            });
                        });
                    };
                });

        });
    }

    generateSplace(level: number): string {
        let returnData = '';
        for (let i = 0; i < level; i++) {
            returnData += '---';
        }
        if (level > 0) {
            returnData += '>';
        }
        return returnData;
    }

    subCreate(value: MeetingAgendaModel): void {
        const inputData: InputFormData<MeetingAgendaModel> = new InputFormData<MeetingAgendaModel>();
        inputData.data = new MeetingAgendaModel({});
        inputData.data.meetingId = this.meetingId;
        inputData.data.parentId = value.id;
        inputData.action = 'add';
        this._formPopup = this._matDialog.open(MeetingAgendaFormComponent, {
            panelClass: 'full-dialog',
            width: '100%',
            data: inputData
        });
        this._formPopup.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
            this.loadData();
        });
    }

    create2(): void {
        this._splash.show();
        this._service.getAgendaReserve(this.meetingId).pipe(take(1)).subscribe(() => {
            this._splash.hide();
            const inputData: InputFormData<MeetingAgendaModel> = new InputFormData<MeetingAgendaModel>();
            inputData.data = new MeetingAgendaModel({});
            inputData.data.meetingId = this.meetingId;
            inputData.action = 'add';
            this._formPopup2 = this._matDialog.open(MeetingAgendaForm2Component, {
                panelClass: 'full-dialog',
                width: '100%',
                height: '100%',
                data: inputData
            });
            this._formPopup2.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
                this.loadData();
            });
        });
    }
    createReserveChild(item: MeetingAgendaModel): void {
        this._splash.show();
        this._service.getAgendaReserve(this.meetingId).pipe(take(1)).subscribe(() => {
            this._splash.hide();
            const inputData: InputFormData<MeetingAgendaModel> = new InputFormData<MeetingAgendaModel>();
            inputData.data = item;
            inputData.action = 'add';
            this._formPopup2 = this._matDialog.open(MeetingAgendaForm2Component, {
                panelClass: 'full-dialog',
                width: '100%',
                height: '100%',
                data: inputData
            });
        });
    }

    edit(rowData: MeetingAgendaModel): void {
        this._service.getData(rowData.id).pipe(take(1)).subscribe((value) => {
            const inputData: InputFormData<MeetingAgendaModel> = new InputFormData<MeetingAgendaModel>();
            inputData.data = value;
            inputData.action = 'edit';
            this._formPopup = this._matDialog.open(MeetingAgendaFormComponent, {
                panelClass: 'full-dialog',
                width: '100%',
                height: '99%',
                data: inputData
            });
            this._formPopup.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
                this.loadData();
            });
        });
    }
    drop(event: CdkDragDrop<MeetingAgendaModel[]>): void {
        const oldData = event.container.data[event.previousIndex];
        const replaceData = event.container.data[event.currentIndex];
        this._service.move(oldData.id, replaceData.id).pipe(take(1)).subscribe(() => {
            this.loadData();
        });
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
    dropChild(event: any, items: MeetingAgendaModel[]): void {
        moveItemInArray(items, event.previousIndex, event.currentIndex);
    }
    deleteAgenda(rowData: MeetingAgendaModel): void {
        Swal.fire({
            title: '',
            text: 'Do you want to delete this item?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                this._service.delete(rowData.id).pipe(take(1)).subscribe(() => {
                    Swal.fire('', 'Data has been deleted.').then(() => {
                        this.loadData();
                    });
                });
            }
        });
    }

    moveDown(rowData: MeetingAgendaModel): void {
        this._service.moveDown(rowData.id).pipe(take(1)).subscribe(() => {
            this.loadData();
        });
    }

    moveUp(rowData: MeetingAgendaModel): void {
        this._service.moveUp(rowData.id).pipe(take(1)).subscribe(() => {
            this.loadData();
        });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}
