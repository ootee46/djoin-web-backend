import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { QueryListModel } from 'app/models/query-list.model';
import { forkJoin, Observable, of } from 'rxjs';

import { MeetingMgmService } from '../meeting-mgm.service';
import { AgendaService } from './agenda/agenda.service';
import { AttendeeService } from './attendee/attendee.service';
import { FileOpenService } from './file-open/file-open.service';
import { FollowUpService } from './follow-up/follow-up.service';
import { InvitationService } from './invitation/invitation.service';
import { JoinResultService } from './join-result/join-result.service';
import { AgendaMinuteService } from './agenda-minute/agenda-minute.service';
import { VoteResultService } from './vote-result/vote-result.service';
import { MinuteService } from './minute/minute.service';

@Injectable({
  providedIn: 'root'
})
export class MeetingEditResolver implements Resolve<Observable<any>>
{
  constructor(private _service: MeetingMgmService
    , private _agendaService: AgendaService
    , private _attendeeService: AttendeeService
    , private _invitationService: InvitationService
    , private _voteService: VoteResultService
    , private _joinService: JoinResultService
    , private _followService: FollowUpService
    , private _fileService: FileOpenService
    , private _agendaMinuteService: AgendaMinuteService
    , private _minuteService: MinuteService

  ) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const searchQuery = new QueryListModel({});
    const id = route.paramMap.get('id');
    const meetingId = parseInt(id, 10);
    if (route && route.url && route.url.length > 0) {
      const urlPath = route.url[0].path.toLowerCase();
      const resolverDatas: any = [];
      searchQuery.catId = meetingId;
      resolverDatas.push(this._service.getData(id));
      if (urlPath === 'overview') {
        resolverDatas.push(this._agendaService.getDatas(searchQuery));
        resolverDatas.push(this._service.getMeetingGroup());
        resolverDatas.push(this._service.getMeetingType());
        resolverDatas.push(this._service.getDocumentType());
        resolverDatas.push(this._service.getVenue());
        resolverDatas.push(this._service.getAgendaApproveFlow());
        this._service.getAttendee(id);
      }
      else if (urlPath === 'attendee') {
        resolverDatas.push(this._attendeeService.getDatas(id));
        resolverDatas.push(this._attendeeService.getUserGroup());
      }
      else if (urlPath === 'agenda') {
        resolverDatas.push(this._agendaService.getDatas(searchQuery));
        resolverDatas.push(this._service.getAttendee(id));
        resolverDatas.push(this._service.getUserGroup(id));
        resolverDatas.push(this._service.getDocumentType());
        resolverDatas.push(this._service.getAllUser());
      }
      else if (urlPath === 'reserve') {
        resolverDatas.push(this._service.getAgendaRequest(id));
      }
      else if (urlPath === 'invitation') {
        resolverDatas.push(this._service.getAttendee(id));
        resolverDatas.push(this._invitationService.getDatas(searchQuery));
      }
      else if (urlPath === 'vote') {
        resolverDatas.push(this._voteService.getDatas(searchQuery));
      }
      else if (urlPath === 'join') {
        resolverDatas.push(this._joinService.getDatas(meetingId));
      }
      else if (urlPath === 'follow') {
        resolverDatas.push(this._service.getAttendee(id));
        resolverDatas.push(this._followService.getDatas(searchQuery));
      }
      else if (urlPath === 'follow') {
        resolverDatas.push(this._followService.getDatas(searchQuery));
      }
      else if (urlPath === 'file') {
        resolverDatas.push(this._fileService.getDatas(searchQuery));
      }
      else if (urlPath === 'agenda-minute') {
        resolverDatas.push(this._service.getAttendee(id));
        resolverDatas.push(this._agendaMinuteService.getDatas(meetingId));
      }
      else if (urlPath === 'minute') {
        resolverDatas.push(this._service.getAttendee(id));
        resolverDatas.push(this._minuteService.getMinuteHistory(meetingId));
        resolverDatas.push(this._minuteService.getMinuteConfirm(meetingId));
      }
      if (resolverDatas.length > 0) {
        return forkJoin(resolverDatas);
      } else {
        return of(true);
      }
    } else {
      return of(true);
    }

  }
}
