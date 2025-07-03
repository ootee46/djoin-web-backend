import { Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { AgendaModel } from 'app/models/agenda.model';
import { QueryListModel } from 'app/models/query-list.model';
import { Subject, take, takeUntil } from 'rxjs';
import { DocumentUploadService } from './document-upload.service';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { InputFormData } from 'app/models/input-form-data';
import { MatDrawer } from '@angular/material/sidenav';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

@Component({
    selector: 'document-upload',
    templateUrl: './document-upload.component.html'
})
export class DocumentUploadComponent implements OnInit {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    @ViewChild('matDrawer2', { static: true }) matDrawer2: MatDrawer;
    @ViewChild('permissionPanel') private _permissionPanel: TemplateRef<any>;
    datas: AgendaModel[] = [];
    detailMode: string = 'agenda';
    bgSteps = ['bg-sky-200', 'bg-sky-100', 'bg-gray-100', 'bg-gray-100', 'bg-gray-100', 'bg-gray-100', 'bg-gray-100', 'bg-gray-100', 'bg-gray-100', 'bg-gray-100'];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private _query = new QueryListModel({});
    private _permissionPanelOverlayRef: OverlayRef;
    private _templatePortal: TemplatePortal;

    constructor(
        private _service: DocumentUploadService,
        private _overlay: Overlay,
        private _matDialog: MatDialog,
        private _viewContainerRef: ViewContainerRef,
    ) { }

    ngOnInit(): void {
        this._service.getDatas(this._query).pipe(take(1)).subscribe();
        this._service.listData$.pipe(takeUntil(this._unsubscribeAll)).subscribe((values) => {
            if (values) {
                this.datas = values;
            }
        });
    }

    openPermission(target: any): void{
        this._permissionPanelOverlayRef = this._overlay.create({
            backdropClass   : ['bg-gray-700','opacity-40'],
            hasBackdrop     : true,
            scrollStrategy  : this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay.position()
                                  .flexibleConnectedTo(target)
                                  .withFlexibleDimensions(true)
                                  .withViewportMargin(64)
                                  .withLockedPosition(true)
                                  .withPositions([
                                      {
                                          originX : 'start',
                                          originY : 'top',
                                          overlayX: 'start',
                                          overlayY: 'top'
                                      }
                                  ])
        });
        this._templatePortal = new TemplatePortal(this._permissionPanel, this._viewContainerRef);
        this._permissionPanelOverlayRef.attach(this._templatePortal);
        this._permissionPanelOverlayRef.backdropClick().subscribe(() => {
            if ( this._permissionPanelOverlayRef && this._permissionPanelOverlayRef.hasAttached() )
            {
                this._permissionPanelOverlayRef.detach();
            }
            if ( this._templatePortal && this._templatePortal.isAttached )
            {
                this._templatePortal.detach();
            }
        });
    }

    openDetail(id: number): void {
        this.detailMode = 'agenda';
        this.matDrawer.open();
    }
    closeDetail(): void {
        this.detailMode = null;
        this.matDrawer.close();
    }

    openMinuteConfirm(): void {
        this.detailMode = 'confirm';
        this.matDrawer.open();
    }
    openMeetingMinute(): void {
        this.detailMode = 'meeting';
        this.matDrawer.open();
    }


}
