import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { fuseAnimations } from '@fuse/animations';
import { CalendarEventModel } from 'app/models/calendar-event.model';
import { MeetingModel } from 'app/models/meeting.model';
import moment from 'moment';
import { Subject, takeUntil } from 'rxjs';
import { CalendarService } from './calendar.service';


@Component({
    selector: 'calendar',
    templateUrl: './calendar.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class CalendarComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('tooltip') manualTooltip: MatTooltip;
    isLoading: boolean = false;
    calendarOptions: CalendarOptions;
    currentDate: string;
    events: CalendarEventModel[];
    monthMeetings: MeetingModel[] = [];
    private _unsubscribeAll: Subject<any> = new Subject();
    constructor(
        private _service: CalendarService,
        private _router: Router
    ) { }

    ngOnInit(): void {
        this.currentDate = moment().format('YYYY-MM-DD');
        this._service.datas$.pipe(takeUntil(this._unsubscribeAll)).subscribe((value) => {
            this.monthMeetings = value;
        });
        this.calendarOptions = {
            plugins: [dayGridPlugin],
            initialView: 'dayGridMonth',
        };
        setTimeout(() => {
            this.initCalendar();
        }, 0);
        setTimeout(() => {
            this.manualTooltip.hide();
        }, 0);
    }

    initCalendar(): void {
        this.events = [];
        this.monthMeetings.forEach((item) => {
            const obj: CalendarEventModel = new CalendarEventModel();
            obj.title = item.title;
            obj.start = moment(item.startDate).format('YYYY-MM-DD HH:mm') ;
            obj.end = moment(item.endDate).format('YYYY-MM-DD HH:mm') ;;
            obj.extendedProp = item.id.toString();
            obj.url = 'javascript:;';
            obj.color = (item && item.color ? item.color : '#cccccc');
            this.events.push(obj);
        });
        this.calendarOptions =   {
            plugins: [dayGridPlugin],
            initialView: 'dayGridMonth',
            headerToolbar: {
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,dayGridWeek,dayGridDay'
            },
            navLinks: true,
            businessHours: false,
            editable: false,
            events: this.events,
            height: 'auto',
            eventDidMount: (info): void =>{
                this.manualTooltip.show();
                //console.log(info);
                // var tooltip = new Tooltip(info.el, {
                //     title: info.event.extendedProps.description,
                //     placement: 'top',
                //     trigger: 'hover',
                //     container: 'body'
                // });
            },
            eventTimeFormat: {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
                meridiem: 'short',
                omitZeroMinute: false,
            },
            eventClick:  (info): void => { this._router.navigate(['/meeting/meeting-mgm/edit/overview/' + info.event.extendedProps.extendedProp ]);}
          };

    }

    ngAfterViewInit(): void {

    }
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}
