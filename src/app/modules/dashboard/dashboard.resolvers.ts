import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { QueryListModel } from 'app/models/query-list.model';
import { forkJoin, Observable } from 'rxjs';
import { DashboardService } from './dashboard.service';
import { MeetingMgmService } from '../meeting/meeting-mgm/meeting-mgm.service';
import { AgendaReserveService } from '../meeting/agenda-reserve/agenda-reserve.service';

@Injectable({
    providedIn: 'root'
})
export class DashboardResolver implements Resolve<Observable<any>>
{
    constructor(
        private _service: DashboardService,
        private _meetingService: MeetingMgmService,
        private _serviceAgenda: AgendaReserveService,
    ) {
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const searchQuery = new QueryListModel({});

        const urlPath = route.url[0].path.toLowerCase();
        const resolverDatas: any = [];
        resolverDatas.push(this._service.getPackageInfo());
        resolverDatas.push(this._meetingService.getAllMeetingGroup());
        resolverDatas.push(this._meetingService.getMeetingType());
        if(urlPath === 'overview'){
        //    resolverDatas.push();

           resolverDatas.push(this._serviceAgenda.getDatas(searchQuery));
           resolverDatas.push(this._serviceAgenda.getAllUser());
           resolverDatas.push(this._serviceAgenda.getMeeting());
           resolverDatas.push(this._serviceAgenda.getConfidential());
           resolverDatas.push(this._serviceAgenda.getObjective());
        }
        else if(urlPath === 'upcoming'){
            resolverDatas.push(this._service.getUpcommingMeeting(searchQuery));
        }
        else if(urlPath === 'history'){
            resolverDatas.push(this._service.getHistoryMeeting(searchQuery));
        }
        else if(urlPath === 'agenda-approve'){
            resolverDatas.push(this._service.getAgendaApproves(searchQuery));
        }
        else if(urlPath === 'agenda-approve-history'){
            resolverDatas.push(this._service.getAgendaApproveHistories(searchQuery));
        }
        else if(urlPath === 'minute-approve'){
            resolverDatas.push(this._service.getMinuteApproves(searchQuery));
        }
        else if(urlPath === 'agenda-request'){
            resolverDatas.push(this._service.getAgendaRequest(searchQuery));
        }
        else if(urlPath === 'minute-approve-history'){
            resolverDatas.push(this._service.getMinuteApproveHistories(searchQuery));
        }

        return forkJoin(resolverDatas);
    }
}
