import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { AutomatorApiService } from 'src/app/services/automator-api.service';
import { ToastrService } from 'ngx-toastr';
import { OdCopyEditHostComponent } from '../od-copy-edit-host/od-copy-edit-host.component';
import { OdCopyAddAppComponent } from '../od-copy-add-app/od-copy-add-app.component';

@Component({
  selector: 'app-od-copy-env-details',
  templateUrl: './od-copy-env-details.component.html',
  styleUrls: ['./od-copy-env-details.component.scss']
})
export class OdCopyEnvDetailsComponent implements OnInit {
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
    private router: Router,
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
    this.automatorApi.getNewCopyEnvConfig(this.parentEnvId)
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
    document.querySelector('body').scrollIntoView({ block: 'start', behavior: 'smooth' });
  }


  showNoHostApps() {
    this.selectedEnvHost = null;
    this.activeEnv = 'no_host_apps';
    this.listLoading = true;
    this.automatorApi.getNoHostAppsOneDesign(this.parentEnvId).subscribe(res => {
      this.selectedEnvHost = { appDetails: res };
      this.listLoading = false;
    }, err => {
      this.toastr.error(
        "Unable to fetch the data. Kindly reload the page.",
        "Error!"
      );
      this.listLoading = false
    })
  }

  addApp(envId) {
    this.dialog.open(OdCopyAddAppComponent, {
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

  editHost(host) {
    this.dialog.open(OdCopyEditHostComponent, {
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
    this.automatorApi.delCopyEnvHost(host.id).subscribe(res => {
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

  openNewHostDialog() {
    this.dialog.open(OdCopyEditHostComponent, {
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

  saveNoHost() {
    this.automatorApi.saveNoHostApp(this.parentEnvId)
      .subscribe(res => {
        this.toastr.success(
          "Changes saved",
          "Success!"
        );
      }, err => {
        this.toastr.error(
          "Process failed.",
          "Error!"
        );
      });
  }
  deployEnv() {
    this.automatorApi.deployCpyEnvironment(this.parentEnvId)
      .subscribe(res => {
        this.toastr.success(
          "Deployed Environment Successfully...",
          "Success!"
        );
      }, err => {
        this.toastr.error(
          "Deployed environment has failed.",
          "Error!"
        );
      });
  }

  redeployApps() {
    this.automatorApi.copyEnvRedeployApplications(this.parentEnvId)
      .subscribe(res => {
        this.toastr.success(
          "Redeployed applications Successfully...",
          "Success!"
        );
      }, err => {
        this.toastr.error(
          "ReDeploy application failed.",
          "Error!"
        );
      })
  }

  deployConfigServer() {
    this.automatorApi.deployCpyConfigServer(this.parentEnvId)
      .subscribe(res => {
        this.toastr.success(
          "Deployed Config server Successfully...",
          "Success!"
        );
      }, err => {
        this.toastr.error(
          "Deployed Config server failed.",
          "Error!"
        );
      })
  }

  gotoCopyConfig() {
    const url = this.route.snapshot.url.reduce((res, val) => res + '/' + val.path, '/dashboard');
    this.router.navigateByUrl(url + '/config')
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
    document.getElementById('od-copy-app-list').classList.add('hot-pan');
  }

  dragEnd($event) {
    const targetElement = document.elementFromPoint($event.pageX, $event.pageY);

    document.getElementById('od-copy-app-list').classList.remove('hot-pan');
    if (targetElement && targetElement.classList.contains('place-it-here')) {
      const appId = targetElement.id.replace('host-', '');

      this.automatorApi.moveCopyApps({
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
