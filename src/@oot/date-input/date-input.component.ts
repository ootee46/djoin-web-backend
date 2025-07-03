import { Component, Input, ViewChild, ElementRef, forwardRef, Output, EventEmitter, ViewEncapsulation, OnInit, } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, UntypedFormControl, Validator, NgControl, AbstractControl, ValidationErrors, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
const moment = _moment;
@Component({
    selector: 'date-input',
    templateUrl: './date-input.component.html',
    styleUrls: ['./date-input.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DateInputComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: DateInputComponent,
            multi: true
        },
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: {
            parse: {
                dateInput: 'YYYY-MM-DD',
            },
            display: {
                dateInput: 'DD/MM/YYYY',
                monthYearLabel: 'MMM YYYY',
                dateA11yLabel: 'LL',
                monthYearA11yLabel: 'MMMM YYYY',
            },
        } },
    ]
})
export class DateInputComponent implements  OnInit, ControlValueAccessor, Validator   {

    @ViewChild('dateInput') dateInput: ElementRef;
    @ViewChild(NgControl) ngControl: NgControl;
    @Input() displayText: string;
    @Input() rangeType: string;
    @Input() value: string;
    @Input() showClear: boolean;
    @Input() min: Date;
    @Input() max: Date;
    @Input() controlClass: string;
    @Output() dateChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    public output: string = '';
    public minDate: Date = null;
    public maxDate: Date = null;
    public isRequired: boolean = false;
    private _rangeDate: BehaviorSubject<string> = new BehaviorSubject<string>(null);


    constructor() {
        this._rangeDate.subscribe((dateData: string) => {
            this.maxDate = null;
            this.minDate = null;
            if (moment(dateData).format('YYYY-MM-DD') !== 'Invalid date' && (this.rangeType === 'start' || this.rangeType === 'end')) {
                if (this.rangeType === 'start') {
                    this.maxDate = moment(dateData, 'YYYY-MM-DD').toDate();
                }else{
                    this.maxDate = null;
                }
                if (this.rangeType === 'end') {
                    this.minDate = moment(dateData, 'YYYY-MM-DD').toDate();
                }else{
                    this.minDate = null;
                }
            }

        });

    }

    get rangeDate(): string {
        return this._rangeDate.getValue();
    }
    @Input() set rangeDate(value: string) {
        this._rangeDate.next(value);
    }


    ngOnInit(): void {
        if(this.min){
            this.minDate = this.min;
        }
        if(this.max){
            this.maxDate = this.max;
        }
    }

    onChanged: any = () => { };
    onTouched: any = () => { };
    writeValue(value: any): void {
        if (value !== undefined && value !== null && value !== '') {
            this.output = moment(value, moment.ISO_8601['YYYY-MM-DD']).format('YYYY-MM-DD');
        } else {
            this.output = null;
        }
    }
    propagateChange = (_: any): void => { };
    registerOnChange(fn: any): void {
        this.onChanged = fn;
    }
    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }
    coerceBooleanProperty(value: any): boolean {
        return value != null && `${value}` !== 'false';
    }
    doDateChange(type: string, event: MatDatepickerInputEvent<Date>): void {
        if (this.output && this.output !== '') {
            this.output = moment(event.value).format('YYYY-MM-DD');
            this.onChanged(moment(event.value).format('YYYY-MM-DD'));
            this.onTouched();
            this.dateChange.emit();
        }
    }
    validate(control: AbstractControl): ValidationErrors | null {
        this.isRequired = control.hasValidator(Validators.required);
        return null;
    }
    clearDate(): void {
        this.output = null;
        this.onChanged(null);
        this.onTouched();
        this.dateChange.emit();
    }

}
