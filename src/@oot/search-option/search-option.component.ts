import { Component, Input, OnInit, forwardRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, UntypedFormControl, Validator, AbstractControl, ValidationErrors, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { BehaviorSubject, Observable, Subject, pipe } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'search-option',
    templateUrl: './search-option.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SearchOptionComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: SearchOptionComponent,
            multi: true
        }
    ]
})
export class SearchOptionComponent implements OnInit, OnDestroy, ControlValueAccessor, Validator {
    @Input() displayText: string;
    @Input() class: string;
    @Input() multiple: boolean;
    @Input() value: any;
    @Input() showOnStart: boolean;
    @Input() showAll: boolean;
    @Input() text: string;
    @Input() options$: Observable<any>;
    @Input() options: any;
    @Input() placeholder: string;
    @Input() allText: string;
    @Input() filterValue: any;
    @Output() selectionChange: EventEmitter<MatSelectChange> = new EventEmitter<MatSelectChange>();
    searchControl: UntypedFormControl = new UntypedFormControl();
    selectValue: any;
    reviseOptions: OptionValue[] = [];
    optionFilter: Observable<OptionValue[]>;
    public isRequired: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject();

    constructor() {
        if (this.showOnStart == null || this.showOnStart === undefined) {
            this.showOnStart = true;
        }
    }

    ngOnInit(): void {
        if (this.options) {
            this.initControl();
        }
        if (this.options$) {
            this.options$.pipe(takeUntil(this._unsubscribeAll)).subscribe((value) => {
                this.options = value;

                if (this.options) {
                    this.initControl();
                }
            });
        }


    }

    initControl(): void {
        if (Array.isArray(this.options)) {
            if(typeof(this.value) === 'string'){
                this.reviseOptions = this.options.map((resp: any) => ({
                    value: resp[this.value],
                    text: resp[this.text]
                }));
            }else{
                this.reviseOptions = this.options.map((resp: any) => ({
                    value: resp,
                    text: resp[this.text]
                }));
            }

            if (this.filterValue && Array.isArray(this.filterValue) && this.filterValue.length > 0) {
                this.reviseOptions = this.reviseOptions.filter((c: any) => this.filterValue.find(a => a === c.value) == null);
            }
            this.optionFilter = this.searchControl.valueChanges.pipe(
                startWith(''),
                map(val => this.filterData(val))
            );
            if (this.selectValue && this.showOnStart === false) {
                if (Array.isArray(this.selectValue)) {
                    this.optionFilter = new Observable<OptionValue[]>((valueData) => {
                        valueData.next(this.reviseOptions.filter(_data => this.selectValue.indexOf(_data.value)));
                    });
                }
                else {
                    this.optionFilter = new Observable<OptionValue[]>((valueData) => {
                        valueData.next(this.reviseOptions.filter(_data => _data.value === this.selectValue));
                    });
                }
            }
        }
    }

    coerceBooleanProperty(value: any): boolean {
        return value != null && `${value}` !== 'false';
    }

    validate(control: AbstractControl): ValidationErrors | null {
        this.isRequired = control.hasValidator(Validators.required);
        return null;
    }

    onChanged: any = () => { };
    onTouched: any = () => { };

    writeValue(value: any): void {
        if (value !== undefined) {
            this.selectValue = value;
            if (this.showOnStart === false) {
            }
        }
    }
    propagateChange = (_: any): void => { };
    registerOnChange(fn: any): void {
        this.onChanged = fn;
    }
    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    returnValue(event): void {
        const selectText = this.reviseOptions.find(c => c.value === event);
        if (this.showOnStart === false) {
            if (selectText) {
                this.searchControl.patchValue(selectText.text);
            }
        }
        this.onChanged(event);
    }
    onSelectionChange(event: MatSelectChange): void {
        this.selectionChange.emit(event);
    }


    filterData(val: string): OptionValue[] {
        if (this.showOnStart === false) {
            if (Array.isArray(this.reviseOptions) && this.reviseOptions.length > 0 && val.length > 0) {
                return this.reviseOptions.filter(_data => _data.text?.toLowerCase().indexOf(val.toLowerCase()) !== -1);
            } else {
                return [];
            }
        } else {

            if (Array.isArray(this.reviseOptions) && this.reviseOptions.length > 0) {
                return this.reviseOptions.filter(_data => _data.text?.toLowerCase().indexOf(val.toLowerCase()) !== -1);
            } else {
                return [];
            }
        }
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}

export interface OptionValue {
    value: any;
    text: string;
}
