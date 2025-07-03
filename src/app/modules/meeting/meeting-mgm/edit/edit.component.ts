import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { MeetingModel } from 'app/models/meeting.model';
import { Subject, takeUntil } from 'rxjs';
import { MeetingMgmService } from '../meeting-mgm.service';

@Component({
    selector: 'meeting-mgm-edit',
    templateUrl: './edit.component.html'
})
export class MeetingMgmEditComponent implements OnInit, OnDestroy {
    @ViewChild('myForm') myForm: NgForm;
    @ViewChild('drawer') drawer: MatDrawer;
    action: string;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    panels: any[] = [];
    selectedPanel: string = 'overview';
    data: MeetingModel = null;
    validPaths = ['overview','attendee','agenda','reserve','agenda-minute','minute','invitation','join','vote','follow','file'];
    id: string;
    requestId: string;
    meetingId: number;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        private _service: MeetingMgmService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService
    ) { }

    ngOnInit(): void {
        if(this._route.snapshot && this._route.snapshot.url && this._route.snapshot.url.length > 0)
        {
          const urlPath = this._route.snapshot.url[0].path.toLowerCase();
          if(this.validPaths.includes(urlPath))
          {
            this.selectedPanel = urlPath;
          }
        }
        this.id = this._route.snapshot.paramMap.get('id');
        this.requestId = this._route.snapshot.paramMap.get('requestId');
        this.meetingId = parseInt(this.id,10);
        this._service.data$.pipe(takeUntil(this._unsubscribeAll)).subscribe((value)=>{
            this.data = value;
        });
        this.panels = [
            {
                id: 'overview',
                title: 'Overview',
                alertCount: 0,
                description: ''
            },
            {
                id: 'attendee',
                title: 'Attendees',
                alertCount: 0,
                description: ''
            },
            {
                id: 'agenda',
                title: 'Agendas',
                alertCount: 0,
                description: ''
            },
            {
                id: 'reserve',
                title: 'Agenda Reservations',
                alertCount: 0,
                description: ''
            },
            {
                id: 'agenda-minute',
                title: 'Minutes of Agendas',
                alertCount: 0,
                description: ''
            },
            {
                id: 'minute',
                title: 'Minutes of Meeting',
                alertCount: 0,
                description: ''
            },
            // {
            //     id: 'document-upload',
            //     title: 'Document Upload',
            //     alertCount: 2,
            //     description: ''
            // },
            {
                id: 'invitation',
                title: 'Invitations',
                alertCount: 0,
                description: ''
            },
            {
                id: 'vote',
                title: 'Voting Result',
                alertCount: 0,
                description: ''
            },
            {
                id: 'join',
                title: 'Join Result',
                alertCount: 0,
                description: ''
            },
            {
                id: 'follow',
                title: 'Follow Up',
                alertCount: 0,
                description: ''
            },
            {
                id: 'file',
                title: 'File Open',
                alertCount: 0,
                description: ''
            }
        ];
        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {

                // Set the drawerMode and drawerOpened
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                    this.drawerOpened = true;
                }
                else {
                    this.drawerMode = 'over';
                    this.drawerOpened = false;
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    goToPanel(panel: string): void {
        if(!this.requestId){
            this._router.navigate(['../../',panel,this.id],{relativeTo:this._route});
        }
        else{
            this._router.navigate(['../../../',panel,this.id],{relativeTo:this._route});
        }
        if (this.drawerMode === 'over') {
            this.drawer.close();
        }
    }
    getPanelInfo(id: string): any {
        return this.panels.find(panel => panel.id === id);
    }
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}
