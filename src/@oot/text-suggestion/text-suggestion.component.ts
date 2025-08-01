/* eslint-disable @typescript-eslint/member-ordering */
import { Component, Input, OnDestroy, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'text-suggestion',
    templateUrl: './text-suggestion.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TextSuggestionComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: TextSuggestionComponent,
            multi: true
        }
    ]
})
export class TextSuggestionComponent implements OnInit, OnDestroy, ControlValueAccessor {
    @Input() displayText: string;
    @Input() value: string;
    @Input() options: string[];
    public _required: any = false;
    public _disabled: any = false;
    searchControl: FormControl = new FormControl();
    reviseOptions: string[] = [];
    optionFilter: Observable<string[]>;
    private _options: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(null);
    private _unsubscribeAll: Subject<any> = new Subject();
    constructor() { }


    @Input()
    set required(value: boolean) { this._required = this.coerceBooleanProperty(value); }
    get required(): boolean { return this._required; }


    @Input()
    set disabled(value: boolean) { this._disabled = this.coerceBooleanProperty(value); }
    get disabled(): boolean { return this._disabled; }




    ngOnInit(): void {
        if (this._disabled) {
            this.searchControl.disable();
        }
        if (this._required) {
            this.searchControl.addValidators([Validators.required]);
        }
        this.searchControl.patchValue(this.value);

        this.optionFilter = new Observable<string[]>((valueData) => {
            valueData.next(this.options.filter(_data => _data === this.searchControl?.value));
        });
        this.optionFilter = this.searchControl.valueChanges.pipe(
            map(val => this.filterData(val))
        );

    }
    filterData(val: string): string[] {
        this.onChanged(val);
        if(val == null || val === ''){
            return [];
        }
        if (Array.isArray(this.options) && this.options.length > 0) {
            return this.options.filter(_data => _data.toLowerCase().indexOf(val.toLowerCase()) !== -1);
        } else {
            return [];
        }
    }
    coerceBooleanProperty(value: any): boolean {
        return value != null && `${value}` !== 'false';
    }

    validate({ value }: FormControl): boolean {
        if (this._required && !this.searchControl?.value) {
            return false;
        }
        else {
            return true;
        }
    }
    onChanged: any = () => { };
    onTouched: any = () => { };
    writeValue(value: any): void {
        if (value !== undefined) {
            this.searchControl?.patchValue(value);
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
        this.onChanged(event);
    }
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}

