import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { AgendaRequestAttachmentModel, AgendaRequestItemListModel, AgendaRequestItemModel } from 'app/models/agenda-request.model';
import { InputFormData } from 'app/models/input-form-data';
import { QueryListModel } from 'app/models/query-list.model';
import { UserModel } from 'app/models/user.model';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { MeetingMgmService } from '../../meeting-mgm.service';
import { AgendaReservationPermissionComponent } from './view-permission/view-permission.component';
import { Buffer } from 'buffer';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';
import * as moment from 'moment';
import { PlatformLocation } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MeetingModel } from 'app/models/meeting.model';
import { AgendaReserveService } from 'app/modules/meeting/agenda-reserve/agenda-reserve.service';
import { BookingExportModel } from 'app/models/booking-export.model';
import Swal from 'sweetalert2';
import { EmptyIfNull, SplitArrayToExcelLineWithNumber } from 'app/helpers/util';
import { MeetingRelationModel } from 'app/models/meeting-relation.model'

@Component({
    selector: 'agenda-reservation',
    templateUrl: './agenda-reservation.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AgendaReservationComponent implements OnInit, OnDestroy {
    @ViewChild('scrollTable', { static: false }) scroll: ElementRef;
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    listData$: Observable<AgendaRequestItemListModel[]>;
    relation$: Observable<MeetingRelationModel[]>;
    datas: AgendaRequestItemListModel[] = [];
    data$: Observable<AgendaRequestItemModel>;
    data: AgendaRequestItemModel;
    presenters: UserModel[] = [];
    excludeUsers: UserModel[] = [];
    isLoading: boolean = false;
    searchQuery: QueryListModel = new QueryListModel({});
    meeting: MeetingModel = null;
    id: string;
    sortAttachments: {
        fieldName: string,
        sort: 'asc' | 'desc'
    }
    sortPresenters: {
        fieldName: string,
        sort: 'asc' | 'desc'
    }
    relationId: string;
    isBookingDetail: boolean = false;
    bookingDetail: string;
    isRelationBookingPanel: boolean = false;
    relation: MeetingRelationModel[] = [];
    private meetingId: number;
    private _formPopup: MatDialogRef<AgendaReservationPermissionComponent>;
    private _unsubscribeAll: Subject<any> = new Subject();
    private _query = new QueryListModel({});
    private _baseHref: string = '';
    constructor(
        private _meetingService: MeetingMgmService
        , private _agendaReserveService: AgendaReserveService
        , private _router: Router
        , private _platformLocation: PlatformLocation
        , private _route: ActivatedRoute
        , private _splash: FuseSplashScreenService
        , private _matDialog: MatDialog
        , private _activatedRoute: ActivatedRoute
        , private _http: HttpClient
    ) { }

    ngOnInit(): void {
        this._baseHref = this._platformLocation.getBaseHrefFromDOM();
        this.id = this._route.snapshot.paramMap.get('id');
        this.meetingId = parseInt(this._route.snapshot.paramMap.get('id'), 10);
        this._meetingService.data$.pipe(takeUntil(this._unsubscribeAll)).subscribe((value) => {
            this.meeting = value;
        });

        this.listData$ = this._meetingService.agendaRequests$;
        this.listData$.pipe(takeUntil(this._unsubscribeAll)).subscribe((value) => {
            this.datas = value;
        });
        this.data$ = this._meetingService.agendaRequestDetail$;
        this.data$.pipe(takeUntil(this._unsubscribeAll)).subscribe((value) => {
            this.data = value;
            if(value.bookingDetail){
                this.isBookingDetail = !!value.bookingDetail
                this.bookingDetail = value.bookingDetail
            }
            if (value.presenters && value.presenters.length > 0) {
                this.presenters = value.presenters;
            }
            if (value.excludeUsers && value.excludeUsers.length > 0) {
                this.excludeUsers = value.excludeUsers;
            }
            this.relateBooking(value)
        });
        this.sortAttachments = {
            fieldName: 'fileName',
            sort: 'asc'
        }
        this.sortPresenters = {
            fieldName: 'fileName',
            sort: 'asc'
        }
    }

    relateBooking(value: AgendaRequestItemModel): void {
        if (value.id) {
            this.isRelationBookingPanel = !!value.id;
            this.relationId = value.id.toString();
            this.relation$ = this._agendaReserveService.getRelation(this.relationId);
            this.relation$.pipe(takeUntil(this._unsubscribeAll)) .subscribe((value) => {
                    this.relation = value;
            });
        }
    }

    openPermission(item: AgendaRequestAttachmentModel): void {
        const inputData: InputFormData<AgendaRequestAttachmentModel> = new InputFormData<AgendaRequestAttachmentModel>();
        inputData.data = item;
        inputData.action = 'add';
        this._formPopup = this._matDialog.open(AgendaReservationPermissionComponent, {
            panelClass: 'standard-dialog',
            data: inputData
        });
    }
    export(): void {
        this._agendaReserveService.export(this.meetingId).pipe(take(1)).subscribe((value: BookingExportModel) => {
            if (!value || !value.items || value.items.length === 0) {
                Swal.fire('', 'No data to export.', 'warning');
                return;
            }

            const wb = new ExcelJS.Workbook();
            const reader = new FileReader();
            this._http.get(this._baseHref + 'assets/templates/agenda-reserve.xlsx', { responseType: 'blob' }).pipe(take(1))
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
                                worksheet.getCell('A' + indexStart).value = (index + 1);
                                worksheet.getCell('B' + indexStart).value = EmptyIfNull(item.agendaNo) + EmptyIfNull(':') + item.title;
                                worksheet.getCell('C' + indexStart).value = item.objective;
                                worksheet.getCell('D' + indexStart).value = item.confidentialLevel;
                                worksheet.getCell('E' + indexStart).value = item.owner;
                                worksheet.getCell('F' + indexStart).value = SplitArrayToExcelLineWithNumber(item.agendaTeams);
                                worksheet.getCell('F' + (indexStart)).alignment = { wrapText: true, vertical: 'middle' };
                                worksheet.getCell('G' + indexStart).value = SplitArrayToExcelLineWithNumber(item.presenters);
                                worksheet.getCell('G' + (indexStart)).alignment = { wrapText: true, vertical: 'middle' };
                                worksheet.getCell('H' + indexStart).value = moment(item.bookingDate).format('DD/MM/YYYY HH:mm');
                                worksheet.getCell('I' + indexStart).value = item.useTime;
                                worksheet.getCell('J' + indexStart).value = SplitArrayToExcelLineWithNumber(item.presenterAttachments);
                                worksheet.getCell('J' + (indexStart)).alignment = { wrapText: true, vertical: 'middle' };
                                worksheet.getCell('K' + indexStart).value = SplitArrayToExcelLineWithNumber(item.attachments);
                                worksheet.getCell('K' + (indexStart)).alignment = { wrapText: true, vertical: 'middle' };
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
                                FileSaver.saveAs(blob, 'agenda-reservation-' + moment().format('YYYY-MM-DD') + '.xlsx');
                            });
                        });
                    };
                });
        });

    }
    setAttachmentsSort(key: string): void {
        if (key === this.sortAttachments.fieldName) {
            this.sortAttachments.sort = this.sortAttachments.sort === 'asc' ? 'desc' : 'asc'
        } else {
            this.sortAttachments.fieldName = key
            this.sortAttachments.sort = 'asc'
        }

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

    loadData(): void {
        this._meetingService.getAgendaRequest(this.id).pipe(take(1)).subscribe();
    }
    viewDetal(item: AgendaRequestItemListModel): void {
        this._splash.show();
        this._meetingService.getAgendaRequestDetail(item.id).pipe(take(1)).subscribe(() => {
            this._splash.hide();
            this.matDrawer.open();
        });
    }
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}
