import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AutomatorApiService } from 'src/app/services/automator-api.service';
import { MatDialog } from '@angular/material';
import { switchMap } from 'rxjs/operators';
import { PermissionManagerComponent } from './permission-manager/permission-manager.component';

@Component({
  selector: 'app-ot-permission',
  templateUrl: './ot-permission.component.html',
  styleUrls: ['./ot-permission.component.scss']
})
export class OtPermissionComponent implements OnInit {
  isBusy = false;

  searchTrack: FormGroup;

  listOfChanges = [];
  fromDateTrigger = false;
  toDateTrigger = false;

  constructor(private toastr: ToastrService,
    private automatorApi: AutomatorApiService,
    private dialog: MatDialog) {
    this.searchTrack = new FormGroup({
      fromDate: new FormControl(new Date()),
      toDate: new FormControl(new Date())
    })
  }

  ngOnInit() {
  }

  setFromDate(date) {
    this.searchTrack.get('fromDate').patchValue(date);
    this.fromDateTrigger = false;
  }
  setToDate(date) {
    this.searchTrack.get('toDate').patchValue(date);
    this.toDateTrigger = false;
  }
  getResults() {
    if (this.isBusy) { return; }
    this.isBusy = true;

    const objectType = [];

    const from = this.searchTrack.value.fromDate + " 0:0:0";
    const to = this.searchTrack.value.toDate + " 23:59:59";

    const data = {
      ...this.searchTrack.value,
      objectType: objectType,
      fromDate: from,
      toDate: to
    };
    this.listOfChanges = [];
    this.automatorApi.getAuditPermission(data)
      .subscribe(
        result => {
          this.listOfChanges = result;
          this.isBusy = false;
        },
        err => {
          this.isBusy = false;
        }
      );
  }

  rollBack(id, envName) {
    this.automatorApi
      .postRollbackPermission([id], envName)
      .subscribe(result => {
        this.toastr.success('Rollback Successfully...', 'Success!');
      },
        err => {
          this.toastr.error('Rollback Failed...', 'Fail!');
        });
  }

  openPermissions(item) {
    this.dialog.open(PermissionManagerComponent, {
      data: item,
      width: "900px",
      height: "650px",
      panelClass: 'mwa-dialog',
      autoFocus: false
    });
  }

}
