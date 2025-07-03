import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { PackageInfoModel } from 'app/models/package-info.model';
import { Observable } from 'rxjs';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
  validPaths = ['overview', 'upcoming', 'history', 'agenda-approve', 'agenda-approve-history', 'minute-approve','minute-approve-history', 'agenda-request'];
  selectedPanel: string = 'overview';
  user$: Observable<User>;
  package$: Observable<PackageInfoModel>;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _service: DashboardService,
  ) { }

  ngOnInit(): void {
    const urlPath = this._route.snapshot.url[0].path.toLowerCase();
    if (this.validPaths.includes(urlPath)) {
      this.selectedPanel = urlPath;
    }
    this.package$ = this._service.packageInfo$;
    this.user$ = this._userService.get();
  }

}
