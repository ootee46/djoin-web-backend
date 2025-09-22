import {
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
} from '@angular/core';
import {
    AbstractControlOptions,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MeetingFormModel, MeetingModel } from 'app/models/meeting.model';
import { StandardModel } from 'app/models/standard.model';
import { CustomValidator } from 'app/validators/custom.validate';
import moment from 'moment';
import { Observable, Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { MeetingMgmService } from '../../meeting-mgm.service';
import { GlobalService } from 'app/services/global.service';

@Component({
    selector: 'meeting-overview',
    templateUrl: './overview.component.html',
})
export class OverviewComponent implements OnInit, OnDestroy {
    @Input() data: MeetingModel;
    dataForm: UntypedFormGroup;
    meetingGroups$: Observable<StandardModel[]>;
    meetingTypes$: Observable<StandardModel[]>;
    meetingSubTypes$: Observable<StandardModel[]>;
    agendaApproveFlows$: Observable<StandardModel[]>;
    id: string;
    venues: string[];
    isPrePost: boolean = false;
    private readonly _unsubscribeAll: Subject<any> = new Subject();
    constructor(
        private readonly _service: MeetingMgmService,
        private readonly _formBuilder: UntypedFormBuilder,
        private readonly _changeDetectorRef: ChangeDetectorRef,
        private readonly _route: ActivatedRoute,
        private readonly _globalService: GlobalService
    ) {}

    ngOnInit(): void {
        this.isPrePost =
            this._globalService.packageInfo.featureList?.includes('f7');
        this.dataForm = this.createDataForm();
        if (this.data.isReserved === true) {
            this.dataForm
                .get('reserveStartDate')
                .addValidators([Validators.required]);
            this.dataForm
                .get('reserveEndDate')
                .addValidators([Validators.required]);
            this.dataForm.get('reserveStartDate').updateValueAndValidity();
            this.dataForm.get('reserveEndDate').updateValueAndValidity();
        }
        if (this.data.isAutoEndDate === false) {
            this.dataForm.get('timeEnd').addValidators([Validators.required]);
            this.dataForm.get('timeEnd').updateValueAndValidity();
        }
        this.meetingGroups$ = this._service.meetingGroups$;
        this.meetingTypes$ = this._service.meetingTypes$;
        this.meetingSubTypes$ = this._service.meetingSubTypes$;
        this.agendaApproveFlows$ = this._service.agendaApproveFlows$;
        this.id = this._route.snapshot.paramMap.get('id');

        this.dataForm
            .get('isAutoEndDate')
            .valueChanges.pipe(takeUntil(this._unsubscribeAll))
            .subscribe((value) => {
                setTimeout(() => {
                    if (value === false) {
                        this.dataForm
                            .get('timeEnd')
                            .addValidators([Validators.required]);
                    } else {
                        this.dataForm.get('timeEnd').patchValue(null);
                        this.dataForm
                            .get('timeEnd')
                            .removeValidators([Validators.required]);
                    }
                    this.dataForm.get('timeEnd').updateValueAndValidity();
                    this.dataForm.get('timeEnd').markAllAsTouched();
                    this._changeDetectorRef.markForCheck();
                }, 0);
            });

        this.dataForm
            .get('isReserved')
            .valueChanges.pipe(takeUntil(this._unsubscribeAll))
            .subscribe((value) => {
                setTimeout(() => {
                    if (value === true) {
                        this.dataForm
                            .get('reserveStartDate')
                            .addValidators([Validators.required]);
                        this.dataForm
                            .get('reserveEndDate')
                            .addValidators([Validators.required]);
                        this.dataForm
                            .get('meetingTypeId')
                            .addValidators([Validators.required]);
                        this.dataForm
                            .get('meetingSubTypeId')
                            .addValidators([Validators.required]);
                        this.dataForm
                            .get('agendaApproverFlowId')
                            .addValidators([Validators.required]);
                    } else {
                        this.dataForm.get('reserveStartDate').patchValue(null);
                        this.dataForm.get('reserveEndDate').patchValue(null);
                        this.dataForm
                            .get('reserveStartDate')
                            .removeValidators([Validators.required]);
                        this.dataForm
                            .get('reserveEndDate')
                            .removeValidators([Validators.required]);
                        this.dataForm
                            .get('meetingTypeId')
                            .removeValidators([Validators.required]);
                        this.dataForm
                            .get('meetingSubTypeId')
                            .removeValidators([Validators.required]);
                        this.dataForm
                            .get('agendaApproverFlowId')
                            .removeValidators([Validators.required]);
                    }
                    this.dataForm
                        .get('reserveStartDate')
                        .updateValueAndValidity();
                    this.dataForm
                        .get('reserveEndDate')
                        .updateValueAndValidity();
                    this.dataForm.get('meetingTypeId').updateValueAndValidity();
                    this.dataForm
                        .get('meetingSubTypeId')
                        .updateValueAndValidity();
                    this.dataForm
                        .get('agendaApproverFlowId')
                        .updateValueAndValidity();
                }, 0);
            });

        this._service.venues$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((value) => {
                if (value) {
                    this.venues = value.map((c) => c.name);
                } else {
                    this.venues = [];
                }
            });
    }

    createDataForm(): UntypedFormGroup {
        return this._formBuilder.group(
            {
                id: [this.data.id || 0, [Validators.required]],
                meetingRoomId: [this.data.meetingRoomId, [Validators.required]],
                meetingNo: [
                    this.data.meetingNo,
                    [
                        Validators.required,
                        CustomValidator.whiteSpace,
                        Validators.maxLength(90),
                    ],
                ],
                meetingDate: [
                    this.data.startDate
                        ? moment(this.data.startDate).format('YYYY-MM-DD')
                        : null,
                    [Validators.required],
                ],
                timeStart: [
                    this.data.startDate
                        ? moment(this.data.startDate).format('HH:mm')
                        : null,
                    [
                        Validators.required,
                        Validators.maxLength(5),
                        CustomValidator.whiteSpace,
                        CustomValidator.timeFormat,
                    ],
                ],
                timeEnd: [
                    this.data.endDate
                        ? moment(this.data.endDate).format('HH:mm')
                        : null,
                    [
                        Validators.required,
                        Validators.maxLength(5),
                        CustomValidator.whiteSpace,
                        CustomValidator.timeFormat,
                    ],
                ],
                reserveStartDate: [
                    this.data.reserveStartDate
                        ? moment(this.data.reserveStartDate).format(
                              'YYYY-MM-DD'
                          )
                        : null,
                    [
                        this.data.isReserved
                            ? Validators.required
                            : Validators.nullValidator,
                    ],
                ],
                reserveEndDate: [
                    this.data.reserveEndDate
                        ? moment(this.data.reserveEndDate).format('YYYY-MM-DD')
                        : null,
                    [
                        this.data.isReserved
                            ? Validators.required
                            : Validators.nullValidator,
                    ],
                ],
                title: [
                    this.data.title,
                    [
                        Validators.required,
                        CustomValidator.whiteSpace,
                        Validators.maxLength(900),
                    ],
                ],
                detail: [
                    this.data.detail,
                    [Validators.maxLength(3000), CustomValidator.whiteSpace],
                ],
                venue: [
                    this.data.venue,
                    [
                        Validators.required,
                        Validators.maxLength(200),
                        CustomValidator.whiteSpace,
                    ],
                ],
                conferenceUrl: [
                    this.data.conferenceUrl,
                    [
                        Validators.maxLength(300),
                        CustomValidator.whiteSpace,
                        CustomValidator.urlValidator,
                    ],
                ],
                isAutoEndDate: [this.data.isAutoEndDate || false],
                isConfirmed: [this.data.isConfirmed || false],
                active: [this.data.active, [Validators.required]],
                meetingTypeId: [
                    this.data.meetingTypeId,
                    [
                        this.data.isReserved
                            ? Validators.required
                            : Validators.nullValidator,
                    ],
                ],
                meetingSubTypeId: [
                    this.data.meetingSubTypeId,
                    [
                        this.data.isReserved
                            ? Validators.required
                            : Validators.nullValidator,
                    ],
                ],
                agendaApproverFlowId: [
                    this.data.agendaApproverFlowId,
                    [
                        this.data.isReserved
                            ? Validators.required
                            : Validators.nullValidator,
                    ],
                ],
                isReserved: [
                    this.data.isReserved != null ? this.data.isReserved : false,
                ],
            },
            {
                validators: [
                    CustomValidator.maxTimeValidate('timeStart', 'timeEnd'),
                    CustomValidator.maxDateValidate(
                        'reserveEndDate',
                        'meetingDate',
                        'invalidMaxDate'
                    ),
                    CustomValidator.maxDateValidate(
                        'reserveStartDate',
                        'meetingDate',
                        'invalidMinDate'
                    ),
                ],
            } as AbstractControlOptions
        );
    }

    getMeetingSubType(): void {
        this.dataForm.get('meetingSubTypeId').patchValue(null);
        const meetingTypeId = this.dataForm.get('meetingTypeId').value;
        if (meetingTypeId) {
            this._service
                .getMeetingSubType(meetingTypeId)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() => {});
        }
    }

    doSave(): void {
        if (this.dataForm.valid) {
            const rowData = this.dataForm.getRawValue();
            if (rowData.meetingDate && rowData.timeEnd) {
                rowData.endDate = moment(
                    moment(rowData.meetingDate).format('YYYY-MM-DD') +
                        ' ' +
                        rowData.timeEnd
                ).format('YYYY-MM-DDTHH:mm');
            }
            if (rowData.meetingDate && rowData.timeStart) {
                rowData.startDate = moment(
                    moment(rowData.meetingDate).format('YYYY-MM-DD') +
                        ' ' +
                        rowData.timeStart
                ).format('YYYY-MM-DDTHH:mm');
            }
            const postData = new MeetingFormModel(rowData);
            if (postData.isReserved === true) {
                if (
                    postData.startDate != null &&
                    postData.reserveStartDate != null &&
                    postData.reserveStartDate > postData.startDate
                ) {
                    Swal.fire('', 'Reserve date must less than meeting date.');
                    return;
                }

                if (
                    postData.startDate != null &&
                    postData.reserveEndDate != null &&
                    postData.reserveEndDate > postData.startDate
                ) {
                    Swal.fire('', 'Reserve date must less than meeting date.');
                    return;
                }
            }
            Swal.fire({
                title: '',
                text: 'Do you want to save your changes ?',
                showCancelButton: true,
                confirmButtonText: 'Save',
                cancelButtonText: 'Cancel',
            }).then((result) => {
                if (result.isConfirmed) {
                    this.dataForm.disable();
                    this._service.update(postData).subscribe({
                        next: (resp: MeetingModel) => {
                            Swal.fire('', 'Data has been saved.').then(() => {
                                this.dataForm.enable();
                                this._service
                                    .getData(this.id)
                                    .pipe(takeUntil(this._unsubscribeAll))
                                    .subscribe();
                            });
                        },
                        error: () => {
                            this.dataForm.enable();
                        },
                    });
                }
            });
        }
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
