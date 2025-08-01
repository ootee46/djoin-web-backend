import { Component, Input, OnInit, forwardRef, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, UntypedFormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
    selector: 'select-search',
    templateUrl: './select-search.component.html',
    styleUrls: ['./select-search.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectSearchComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: SelectSearchComponent,
            multi: true
        }
    ]
})
export class SelectSearchComponent implements OnInit, ControlValueAccessor {
    @Input() displayText: string;
    @Input() multiple: boolean;
    @Input() value: string;
    @Input() showOnStart: boolean;
    @Input() showAll: string;
    @Input() text: string;
    @Input() options: any;
    @Output() selectionChange: EventEmitter<MatSelectChange> = new EventEmitter<MatSelectChange>();
    searchControl: UntypedFormControl = new UntypedFormControl();
    selectValue: any;
    reviseOptions: OptionValue[] = [];
    optionFilter: Observable<OptionValue[]>;
    public _required: any = false;


    constructor() {
        if(this.showOnStart == null || this.showOnStart === undefined){
            this.showOnStart = true;
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    // get options() { return this._options.getValue();}
    // @Input() set options(value) {
    //    // console.log(value);
    //     this._options.next(value);
    // }
    // eslint-disable-next-line @typescript-eslint/member-ordering
    get required(): boolean { return this._required; }
    @Input()  set required(value: boolean) { this._required = this.coerceBooleanProperty(value); }


    ngOnInit(): void {
        if (Array.isArray(this.options)) {
            this.reviseOptions = this.options.map((resp: any) =>({
                    value: resp[this.value],
                    text: resp[this.text]
                }));
            this.optionFilter = this.searchControl.valueChanges.pipe(
                startWith(''),
                map(val => this.filterData(val))
            );
            if(this.selectValue && this.showOnStart === false)
            {
                if(Array.isArray(this.selectValue))
                {
                    this.optionFilter = new Observable<OptionValue[]>((valueData)=>{
                        valueData.next(this.reviseOptions.filter(_data => this.selectValue.indexOf(_data.value)));
                    });
                }
                else{
                    this.optionFilter = new Observable<OptionValue[]>((valueData)=>{
                        valueData.next(this.reviseOptions.filter(_data => _data.value === this.selectValue));
                    });
                }
            }
        }
    }

    coerceBooleanProperty(value: any): boolean {
        return value != null && `${value}` !== 'false';
    }

    validate({ value }: UntypedFormControl): boolean {
        if (this._required && !this.selectValue) {
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
            this.selectValue = value;
            if(this.showOnStart === false){
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
        const selectText = this.reviseOptions.find(c=>c.value === event);
        if(this.showOnStart === false){
            if(selectText){
                this.searchControl.patchValue(selectText.text);
            }
        }
        this.onChanged(event);
    }
    onSelectionChange(event: MatSelectChange): void{
        this.selectionChange.emit(event);
    }


    filterData(val: string): OptionValue[] {
        if(this.showOnStart === false){
            if (Array.isArray(this.reviseOptions) && this.reviseOptions.length > 0 && val.length > 0) {
                return this.reviseOptions.filter(_data => _data.text.toLowerCase().indexOf(val.toLowerCase()) !== -1);
            } else {
                return [];
            }
        }else{

            if (Array.isArray(this.reviseOptions) && this.reviseOptions.length > 0 ) {
                return this.reviseOptions.filter(_data => _data.text.toLowerCase().indexOf(val.toLowerCase()) !== -1);
            } else {
                return [];
            }
        }
    }

}

export interface OptionValue {
    value: any;
    text: string;
}
