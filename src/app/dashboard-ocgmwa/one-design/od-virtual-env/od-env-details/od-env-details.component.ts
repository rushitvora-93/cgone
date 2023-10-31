import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AutomatorApiService } from 'src/app/services/automator-api.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { OdAddHostComponent } from '../od-add-host/od-add-host.component';
import { OdAddAppComponent } from '../od-add-app/od-add-app.component';

@Component({
  selector: 'app-od-env-details',
  templateUrl: './od-env-details.component.html',
  styleUrls: ['./od-env-details.component.scss']
})
export class OdEnvDetailsComponent implements OnInit {
  @ViewChild('addNewHostDialog') addNewHostDialog: TemplateRef<any>;
  parentEnvId: string;
  envList = [];
  activeEnv: string;
  selectedEnvHost: any;
  envName: string;
  listLoading = false;

  dialogRef: MatDialogRef<any>;
  targetHost: any;
  selectedDragHostList = [];

  constructor(private route: ActivatedRoute,
    private automatorApi: AutomatorApiService,
    private toastr: ToastrService,
    private dialog: MatDialog) {

  }

  ngOnInit() {
    this.parentEnvId = this.route.snapshot.params.envId;
    this.loadEnv();

    this.automatorApi.getNewEnvList()
      .subscribe((res: any[]) => {
        this.envName = res.filter((item: any) => item.id == this.parentEnvId)[0].envName;
      });
  }

  loadEnv() {
    this.automatorApi.getNewEnvConfig(this.parentEnvId)
      .subscribe((res: any[]) => {
        this.envList = res;
        const setenv = this.envList.filter(it => it.id === this.activeEnv);
        if (setenv[0]) {
          this.showEnv(setenv[0]);
        }
      }, err => {
        this.toastr.error(
          "Unable to fetch the data. Kindly reload the page.",
          "Error!"
        );
      })
  }

  showEnv(env) {
    this.activeEnv = env.id;
    this.selectedEnvHost = env;
  }

  redeployApps() {
    this.automatorApi.redeployApplications(this.parentEnvId)
      .subscribe(res => {
        this.toastr.success(
          "Applications successfully redeployed.",
          "Success!"
        );
      }, err => {
        this.toastr.error(
          "Redeploy failed.",
          "Error!"
        );
      })
  }

  deployConfigServer(id) {
    this.automatorApi.deployConfigServer(this.parentEnvId)
      .subscribe(res => {
        this.toastr.success(
          "Deployed Config server Successfully...",
          "Success!"
        );
      }, err => {
        this.toastr.error(
          "Redeploy failed.",
          "Error!"
        );
      })
  }

  deployEnv() {
    this.automatorApi.deployEnvironment(this.parentEnvId)
      .subscribe(res => {
        this.toastr.success(
          "Deployed Environment Successfully...",
          "Success!"
        );
      }, err => {

      })
  }

  addApp(envId) {
    this.dialog.open(OdAddAppComponent, {
      autoFocus: false,
      width: '600px',
      panelClass: 'mwa-dialog',
      data: {
        envId: envId,
        appId: this.parentEnvId
      }
    }).afterClosed().subscribe(res => {
      if (res) {
        this.loadEnv();
      }
    });
  }

  openNewHostDialog() {
    this.dialog.open(OdAddHostComponent, {
      autoFocus: false,
      width: '600px',
      panelClass: 'mwa-dialog',
      data: {
        envId: this.parentEnvId
      }
    }).afterClosed().subscribe(res => {
      if (res) {
        this.loadEnv();
      }
    });
  }

  editHost(host) {
    this.dialog.open(OdAddHostComponent, {
      autoFocus: false,
      width: '600px',
      panelClass: 'mwa-dialog',
      data: {
        envId: this.parentEnvId,
        host: host
      }
    }).afterClosed().subscribe(res => {
      if (res) {
        this.loadEnv();
      }
    })
  }


  delHost(host: any) {
    this.automatorApi.delVirEnvHost(host.id).subscribe(res => {
      this.envList = this.envList.filter(item => item.id !== host.id);
    }, err => {
      this.toastr.error(
        "Failed.",
        "Error!"
      );
    })
  }

  delVirApp(appId) {
    if (appId) {
      this.automatorApi.delVirEnvApp(appId).subscribe(result => {
        this.selectedEnvHost['appDetails'] = this.selectedEnvHost.appDetails.filter(item => item.id !== appId);
      }, err => {
        this.toastr.error(
          "Failed.",
          "Error!"
        );
      });
    }
  }


  selectDrag(id, checked) {
    if (checked) {
      this.selectedDragHostList.push(id);
    } else {
      const pos = this.selectedDragHostList.indexOf(id);
      if (pos > -1) {
        this.selectedDragHostList.splice(pos, 1);
      }
    }
  }

  onDragOverHost(hostId) {
    this.targetHost = hostId;
    document.getElementById('od-vr-app-list').classList.add('hot-pan');
  }

  dragEnd($event) {
    const targetElement = document.elementFromPoint($event.pageX, $event.pageY);

    document.getElementById('od-vr-app-list').classList.remove('hot-pan');
    if (targetElement && targetElement.classList.contains('place-it-here')) {
      const appId = targetElement.id.replace('host-', '');

      this.automatorApi.moveEnvApps({
        appId: [this.targetHost, ...this.selectedDragHostList],
        toHostId: appId
      }).subscribe(res => {
        this.toastr.success(
          "Apps successfully moved.",
          "Success!"
        );
        this.loadEnv();
      }, err => {
        this.toastr.error(
          "Please try again.",
          "Error!"
        );
      })
    }
  }

}
