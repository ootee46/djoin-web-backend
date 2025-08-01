import { Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm, UntypedFormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { VoteResultModel } from 'app/models/vote-result.model';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { Buffer } from 'buffer';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';
import * as moment from 'moment';
import { VoteResultService } from '../vote-result.service';
import { HttpClient } from '@angular/common/http';
import { PlatformLocation } from '@angular/common';
import { InputFormData } from 'app/models/input-form-data';
import { MeetingAgendaModel } from 'app/models/meeting-agenda.model';
import { MeetingModel } from 'app/models/meeting.model';
import { MeetingMgmService } from '../../../meeting-mgm.service';


@Component({
  selector: 'vote-result-form',
  templateUrl: './form.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class VoteResultFormComponent implements OnInit, OnDestroy {
    @ViewChild('myForm') myForm: NgForm;
    action: string;
    dialogTitle: string;
    datas$:  Observable<VoteResultModel[]>;
    datas:  VoteResultModel[];
    agenda: MeetingAgendaModel;
    meeting: MeetingModel;
    private _unsubscribeAll: Subject<any> = new Subject();
    private _baseHref: string = '';
    constructor(
        private _matDialogRef: MatDialogRef<VoteResultFormComponent>,
        @Inject(MAT_DIALOG_DATA) private input: InputFormData<MeetingAgendaModel>,
        private _http: HttpClient,
        private _platformLocation: PlatformLocation,
        private _service: VoteResultService,
        private _meetingService: MeetingMgmService
    ) { }

    ngOnInit(): void {
        this._baseHref = this._platformLocation.getBaseHrefFromDOM();
        this.datas$ = this._service.voteResults$;
        this.datas$.pipe(takeUntil(this._unsubscribeAll)).subscribe((values)=>{
            this.datas = values;
        });
        this._meetingService.data$.pipe(takeUntil(this._unsubscribeAll)).subscribe((value)=>{
            this.meeting = value;
        });
        this.agenda = this.input.data;
    }

    export(): void{
        const wb = new ExcelJS.Workbook();
        const reader = new FileReader();
        this._http.get(this._baseHref + 'assets/templates/vote-item-result.xlsx', { responseType: 'blob' }).pipe(take(1))
            .subscribe((excelTemplate) => {
                reader.readAsArrayBuffer(excelTemplate);
                reader.onload = (): void => {
                    const buffer: ArrayBuffer = reader.result as ArrayBuffer;
                    const excelData = new Uint8Array(buffer);
                    wb.xlsx.load(Buffer.from(excelData)).then((workbook) => {
                        const worksheet = workbook.getWorksheet(1);
                        worksheet.getCell('B1').value = this.meeting?.meetingNo;
                        worksheet.getCell('B2').value = this.meeting?.title;
                        worksheet.getCell('B3').value = moment(this.meeting?.startDate).format('DD/MM/YYYY') + ' ' + moment(this.meeting?.startDate).format('HH:mm') + '-' + moment(this.meeting?.endDate).format('HH:mm');
                        worksheet.getCell('B4').value = this.agenda?.title;
                        if (this.datas && this.datas.length > 0) {
                            this.datas.forEach((item, index) => {
                                worksheet.getCell('A' + (index + 7)).value = index + 1;
                                worksheet.getCell('B' + (index + 7)).value = item.name;
                                worksheet.getCell('C' + (index + 7)).value = (item.vote === 1 ? 'X': '');
                                worksheet.getCell('D' + (index + 7)).value = (item.vote === -1 ? 'X': '');
                                worksheet.getCell('E' + (index + 7)).value =(item.vote === 0 ? 'X': '');
                                worksheet.getCell('F' + (index + 7)).value =(item.vote === null ? 'X': '');
                                worksheet.getCell('G' + (index + 7)).value = item.remark;
                                worksheet.getCell('H' + (index + 7)).value =(item.createdDate  ? moment(item.createdDate).format('DD/MM/YYYY HH:mm'): '');
                            });
                        }
                        workbook.xlsx.writeBuffer().then((data) => {
                            const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                            FileSaver.saveAs(blob, 'vote-agenda-result-' + moment().format('YYYY-MM-DD') + '.xlsx');
                        });
                    });
                };
            });
    }

    close(): void {
        this._matDialogRef.close();
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }


}
