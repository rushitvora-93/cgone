import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AddRoleDialogComponent } from '../dashboard-ocgmwa/app-header/add-role-dialog/add-role-dialog.component';
import { ChangePasswordDialogComponent } from '../dashboard-ocgmwa/app-header/change-password-dialog/change-password-dialog.component';
import { Login } from '../models/login';
import { Host } from '../models/host';
import { HostDialogComponent } from '../host-dialog/host-dialog.component';
import { DashboardService } from '../services/dashboard.service';
import { AutomatorApiService } from '../services/automator-api.service';
import { HostService } from '../services/host.service';
import { DataTransferService } from '../services/data-transfer.service';
import { NewUserDialogComponent } from '../dashboard-ocgmwa/app-header/new-user-dialog/new-user-dialog.component';

@Component({
  selector: 'app-setup-header',
  templateUrl: './app-setup-header.component.html',
  styleUrls: ['./app-setup-header.component.css']
})
export class AppSetupHeaderComponent implements OnInit {

  host = new Host();
  currentZoom = 100;
  leftmenu: boolean;
  authDetail: any = {};

  constructor(
    public dialog: MatDialog,
    private automatorApi: AutomatorApiService,
    private toastr: ToastrService,
    private hostService: HostService,
    private dashboardService: DashboardService,
    private dataTransferService: DataTransferService,
    private router: Router
  ) { }

  ngOnInit() {
    this.dataTransferService.changeSelectedAppDetails({});
    this.getUserName();
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
        document.cookie = 'JSESSIONID=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        sessionStorage.removeItem('sesId');
        sessionStorage.removeItem('authDetail');
        this.router.navigate(['login']);
      },
      err => {
        this.toastr.error('Something went wrong');
      }
    );
  }

  openHostDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';
    dialogConfig.height = '550px';
    const { hostName, ip, osType, version, lcaPort, solutionControlCenter } = this.host;
    dialogConfig.data = { hostName, ip, osType, version, lcaPort, solutionControlCenter };
    const dialogRef = this.dialog.open(HostDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(hostData => {
      if (hostData) {
        const hostDataToSave = {
          'hostName': hostData.hostName,
          'ip': hostData.ip,
          'osType': hostData.osType,
          'version': hostData.version,
          'solutionControlCenter': hostData.solutionControlCenter,
          'startUpflag': hostData.startUpflag,
          'state': hostData.state ? 'CFGEnabled' : 'CFGDisabled'
        };

        this.hostService.saveNewHost([hostDataToSave])
          .subscribe(
            response => {
              if (response[0].status) {
                this.toastr.error(`Error occured... not able to add the host, error: ${response[0].reason}`, 'Oops!');
              } else {
                this.toastr.success(`Host ${response[0].hostName} added successfully!! Please Refresh the page.`, 'Success!');
                this.dataTransferService.changeNewHostActivity({ action: 'save', data: response[0] });
              }
            },
            err => {
              console.log('Add new host failed..', err);
            });
      }

    });
  }


  getUserName() {
    const authDetail = JSON.parse(sessionStorage.getItem("authDetail"));
    this.authDetail = authDetail;
  }

}
