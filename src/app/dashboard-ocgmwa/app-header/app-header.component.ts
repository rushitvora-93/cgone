import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AddRoleDialogComponent } from './add-role-dialog/add-role-dialog.component';
import { ChangePasswordDialogComponent } from './change-password-dialog/change-password-dialog.component';
import { Login } from '../../models/login';
import { Host } from '../../models/host';
import { HostDialogComponent } from '../../host-dialog/host-dialog.component';
import { DashboardService } from '../../services/dashboard.service';
import { AutomatorApiService } from '../../services/automator-api.service';
import { HostService } from '../../services/host.service';
import { DataTransferService } from '../../services/data-transfer.service';
import { NewUserDialogComponent } from './new-user-dialog/new-user-dialog.component';
import { RouterQuery } from '@datorama/akita-ng-router-store';
import { OnetestService } from 'src/app/store/service/one-test.service';
import { OneCGQuery } from 'src/app/store/query/one-test.query';

@Component({
  selector: 'app-header-dark',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderDarkComponent implements OnInit {
  environmentDetails: Login[] = [];
  host = new Host();
  currentZoom = 100;
  leftmenu: boolean;
  authDetail: any = {};

  pageLabel: string;
  pageSubLabel: string;
  isDashboard = false;

  constructor(
    public dialog: MatDialog,
    private automatorApi: AutomatorApiService,
    private toastr: ToastrService,
    private hostService: HostService,
    private dashboardService: DashboardService,
    private dataTransferService: DataTransferService,
    private router: Router,
    private routerQuery: RouterQuery,
    private oneCGQuery: OneCGQuery
  ) { }

  ngOnInit() {
    this.dataTransferService.changeSelectedAppDetails({});
    this.getUserName();

    this.routerQuery.select().subscribe(res => {
      const sections = res.state.url.split('/');
      this.isDashboard = false;
      switch (sections[2]) {
        case 'home': this.pageLabel = 'Home'; break;
        case 'onechange': this.pageLabel = 'One Change'; break;
        case 'onetrack': this.pageLabel = 'One Track'; break;
        case 'onedesign': this.pageLabel = 'One Design'; break;
        case 'onetest': this.pageLabel = 'One Test'; break;
        default: this.isDashboard = true; this.pageLabel = 'One Connect'; break;
      }

    });

    this.oneCGQuery.currentNavigation().subscribe(label => {
      this.pageSubLabel = label;
    });
  }

  newUserDialog() {
    const dialogRef = this.dialog.open(NewUserDialogComponent, {
      width: '420px',
      panelClass: 'mwa-dialog',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data !== 'cancel') {
        this.automatorApi.addUser(data)
          .subscribe(res => {
            this.toastr.success('New User Added Successfully...', 'Success!');
          }, err => {
            this.toastr.error(`Oops...Not able to Add User.`, 'Failed!');
          })
      }
    })
  }
  addRoleDialog(): void {
    console.log('In.. addRoleDialog..');
    const dialogRef = this.dialog.open(AddRoleDialogComponent, {
      width: '420px',
      panelClass: 'mwa-dialog',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result !== 'cancel') {
        const roleDetail = [];
        roleDetail.push(result);
        this.automatorApi.addUserRole(roleDetail)
          .subscribe(response => {
            if (response) {
              this.toastr.success('New Role Added Successfully...', 'Success!');
            }
          },
            err => {
              this.toastr.error(`Oops...Not able to Add Role.`, 'Failed!');
            });
      }
    });
  }

  changePasswordDialog(): void {
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      width: '420px',
      panelClass: 'mwa-dialog',
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result !== 'cancel') {
        const auth = JSON.parse(sessionStorage.getItem('authDetail'));
        if (auth) {
          result.username = auth.Username;
          this.automatorApi.changePassword(result)
            .subscribe(response => {
              this.toastr.success('Changed Password Successfully...', 'Success!');
            },
              err => {
                this.toastr.error(`Oops...Not able to change Password.`, 'Failed!');
              });
        }
      }
    });
  }

  logOutApplication() {
    this.automatorApi.logOut().subscribe(
      result => {
        this.environmentDetails = [];
        document.cookie = 'JSESSIONID=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        sessionStorage.removeItem('sesId');
        sessionStorage.removeItem('authDetail');
        this.router.navigate(['login']);
      },
      (err: any) => {
        if (err.message == '200' || err.message == 200) {
          this.environmentDetails = [];
          document.cookie = 'JSESSIONID=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
          sessionStorage.removeItem('sesId');
          sessionStorage.removeItem('authDetail');
          this.router.navigate(['login']);
        } else {
          console.log('Oops!', 'Something went wrong.', 'error');
        }
      }
    );
  }

  getUserName() {
    const authDetail = JSON.parse(sessionStorage.getItem("authDetail"));
    this.authDetail = authDetail;
  }

}
