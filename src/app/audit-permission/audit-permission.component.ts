import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { AutomatorApiService } from '../services/automator-api.service';
import { AuditPermissionDetailDialogComponent } from './audit-permission.detail.dialog.component';

@Component({
  selector: 'app-audit-permission',
  templateUrl: './audit-permission.component.html',
  styleUrls: ['./audit-permission.component.css']
})
export class AuditPermissionComponent implements OnInit {
  fromDate: Date;
  toDate: any;
  dataList = [];
  constructor(
    private automatorApi: AutomatorApiService,
    private toastr: ToastrService,
    public detailDialog: MatDialog
  ) {
    const date = new Date();
    this.fromDate = date;
    this.toDate = date;
    //this.submit();
  }

  ngOnInit() {}

  submit() {
    const from = new Date(this.fromDate).getDate() +
      '-' + (new Date(this.fromDate).getMonth() + 1) +
      '-' + new Date(this.fromDate).getFullYear() +
      ' 00:00:00';
    const to = new Date(this.toDate).getDate() +
      '-' + (new Date(this.toDate).getMonth() + 1) +
      '-' + new Date(this.toDate).getFullYear() +
      ' 23:59:59';
    const data = {
      'toDate': to.toString(),
      'fromDate': from.toString()
    };
    this.automatorApi.getAuditPermission(data)
      .subscribe(
        result => {
          this.dataList = result;
        },
        err => {
          console.error('we are in error..', err);
        }
      );
  }
  openRollback(data): void {
    console.log('In Rollback...', data);
    this.automatorApi
      .postRollbackPermission([data.id], data.envName)
      .subscribe(result => {
          this.toastr.success('Rollback Successfully...', 'Success!');
        },
        err => {
          this.toastr.error('Rollback Failed...', 'Fail!');
        });
  }
  openDetailsDialog(data): void {
    console.log('In Open details..', data);
    const dialogRef = this.detailDialog.open(AuditPermissionDetailDialogComponent, {
      width: '950px',
      data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }
}
