import { Component, OnInit } from '@angular/core';
import { MeetingMgmModel } from 'app/models/meeting-mgm.model';
import { Observable } from 'rxjs';
import { ChangMeetingService } from './change-meeting.service';

@Component({
    selector: 'app-change-meeting',
    templateUrl: './change-meeting.component.html'
})
export class ChangeMeetingComponent implements OnInit {
    meetings$: Observable<MeetingMgmModel[] | null>;
    selectId: number = null;
    agendaAttachments: any = [
        {
            fileName:'Attachment1.pdf',
            documentType:'Presentation'
        },
        {
            fileName:'Attachment2.pdf',
            documentType:'General'
        },
        {
            fileName:'Attachment3.pdf',
            documentType:'Other'
        },
        {
            fileName:'Attachment4.pdf',
            documentType:'Presentation'
        }
    ];
    constructor(
        private _service: ChangMeetingService
    ) {
        this.meetings$ = this._service.meetings$;
        this._service.getMeeting().subscribe();
    }

    ngOnInit(): void {
    }

    selectData(item: MeetingMgmModel): void {
        this.selectId = item.id;
    }

}
