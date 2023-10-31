import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AutomatorApiService } from 'src/app/services/automator-api.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-od-copy-object-types',
  templateUrl: './od-copy-object-types.component.html',
  styleUrls: ['./od-copy-object-types.component.scss']
})
export class OdCopyObjectTypesComponent implements OnInit {
  parentEnvId: string;
  envName: string;
  objTypeList = [];
  currentPos = 0;
  copyBusy = false;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private automatorApi: AutomatorApiService,
    private toastr: ToastrService,
    private dialog: MatDialog) {

  }

  ngOnInit() {
    this.parentEnvId = this.route.snapshot.params.envId;

    this.automatorApi.getNewEnvList()
      .subscribe((res: any[]) => {
        this.envName = res.filter((item: any) => item.id == this.parentEnvId)[0].envName;
      });

    this.automatorApi.getVirobjectType().subscribe((res: any) => {
      this.objTypeList = res.list;
    }, err => {

    })
  }

  copyObj(objId) {
    if (this.copyBusy) {
      return;
    }
    this.copyBusy = true;
    this.automatorApi.saveCopyConfig(this.parentEnvId, objId).subscribe(res => {
      this.copyBusy = false;
      this.currentPos++;
    }, err => {
      this.copyBusy = false;
      this.toastr.error(
        "Copying failed",
        "Error!"
      );
    });
  }

  configPerm() {
    this.automatorApi.copyObjectPermissions(this.parentEnvId).subscribe(res => {
      this.toastr.success(
        "Permissions successfully copied!",
        "Success!"
      );
    }, err => {
      this.toastr.error(
        "Copying failed",
        "Error!"
      );
    })
  }

}
