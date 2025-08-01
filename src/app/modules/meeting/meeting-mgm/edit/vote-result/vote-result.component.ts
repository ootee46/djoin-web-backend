/* eslint-disable max-len */
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AgendaModel } from 'app/models/agenda.model';
import { QueryListModel } from 'app/models/query-list.model';
import { Subject, take, takeUntil } from 'rxjs';
import { VoteResultService } from './vote-result.service';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute } from '@angular/router';
import { MeetingAgendaModel } from 'app/models/meeting-agenda.model';
import { Buffer } from 'buffer';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';
import * as moment from 'moment';
import { PlatformLocation } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MeetingModel } from 'app/models/meeting.model';
import { MeetingMgmService } from '../../meeting-mgm.service';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { VoteResultFormComponent } from './form/form.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { InputFormData } from 'app/models/input-form-data';

@Component({
    selector: 'meeting-vote-result',
    templateUrl: './vote-result.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class VoteResultComponent implements OnInit, OnDestroy {

    datas: MeetingAgendaModel[] = [];
    bgSteps = ['bg-sky-200', 'bg-sky-100', 'bg-gray-100', 'bg-gray-100', 'bg-gray-100', 'bg-gray-100', 'bg-gray-100', 'bg-gray-100', 'bg-gray-100', 'bg-gray-100'];
    meeting: MeetingModel = null;
    plainDatas: MeetingAgendaModel[] = [];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private _query = new QueryListModel({});
    private meetingId: number;
    private _baseHref: string = '';
    private _formPopup: MatDialogRef<VoteResultFormComponent>;
    constructor(
        private _route: ActivatedRoute,
        private _matDialog: MatDialog,
        private _platformLocation: PlatformLocation,
        private _service: VoteResultService,
        private _meetingService: MeetingMgmService,
        private _splash: FuseSplashScreenService,
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
                    this.createPlainData(this.datas, 0);
                } else {
                    this.datas = [];
                }
            });
            //this.create();
        }

        this._meetingService.data$.pipe(takeUntil(this._unsubscribeAll)).subscribe((value) => {
            this.meeting = value;
        });
    }
    viewResult(agenda: MeetingAgendaModel): void{
        if(agenda){
            const inputData: InputFormData<MeetingAgendaModel> = new InputFormData<MeetingAgendaModel>();
            inputData.data = agenda;
            this._splash.show();
            this._service.getVoteResult(agenda.id).pipe(take(1)).subscribe(()=>{
                this._splash.hide();
                this._formPopup = this._matDialog.open(VoteResultFormComponent, {
                    panelClass: 'standard-dialog',
                    width: '100%',
                    height: '98%',
                    data: inputData
                });
            });
        }
    }
    loadData(): void {
        this._service.getDatas(this._query).pipe(take(1)).subscribe();
    }

    edit(rowData: AgendaModel): void {

    }
    deleteData(rowData: AgendaModel): void {

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


    export(): void {
        const wb = new ExcelJS.Workbook();
        const reader = new FileReader();
        this._http.get(this._baseHref + 'assets/templates/vote-result.xlsx', { responseType: 'blob' }).pipe(take(1))
            .subscribe((excelTemplate) => {
                reader.readAsArrayBuffer(excelTemplate);
                reader.onload = (): void => {
                    const buffer: ArrayBuffer = reader.result as ArrayBuffer;
                    const excelData = new Uint8Array(buffer);
                    wb.xlsx.load(Buffer.from(excelData)).then((workbook) => {
                        const worksheet = workbook.getWorksheet(1);
                        worksheet.getCell('B1').value = this.meeting.meetingNo;
                        worksheet.getCell('B2').value = this.meeting.title;
                        worksheet.getCell('B3').value = moment(this.meeting.startDate).format('DD/MM/YYYY') + ' ' + moment(this.meeting.startDate).format('HH:mm') + '-' + moment(this.meeting.endDate).format('HH:mm');
                        if (this.plainDatas && this.plainDatas.length > 0) {
                            this.plainDatas.forEach((item, index) => {
                                worksheet.getCell('A' + (index + 6)).value = item.agendaNo;
                                worksheet.getCell('B' + (index + 6)).value = this.generateSplace(item.level) + item.title;
                                worksheet.getCell('C' + (index + 6)).value = item.voteYes || 0;
                                worksheet.getCell('D' + (index + 6)).value = item.voteNo || 0;
                                worksheet.getCell('E' + (index + 6)).value = item.noVote || 0;
                            });
                        }
                        workbook.xlsx.writeBuffer().then((data) => {
                            const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                            FileSaver.saveAs(blob, 'vote-result-' + moment().format('YYYY-MM-DD') + '.xlsx');
                        });
                    });
                };
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}
