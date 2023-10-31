import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AutomatorApiService } from '../../services/automator-api.service';
import { AddConnectionDialogComponent } from './add-connection-dialog/add-connection-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { switchMap } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormArray, FormBuilder } from '@angular/forms';
import { AddConnectedServerDialogComponent } from 'src/app/components/create-new-connected-server-dialog/add-connected-server-dialog.component';

@Component({
  selector: 'app-add-application-dialog',
  templateUrl: './add-application-dialog.component.html',
  styleUrls: ['./add-application-dialog.component.css']
})
export class AddApplicationDialogComponent implements OnInit {

  public appConfig;
  appVersions = [];
  public selectedVersion;
  public availableServers = [];
  public connectedServersIds = [];
  allTemplates = [];
  allPlugins = [];
  allPluginVersions = [];

  formGroup: FormGroup;

  constructor(public dialogRef: MatDialogRef<AddApplicationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public apiService: AutomatorApiService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder) {
    this.formGroup = new FormGroup({
      state: new FormControl(false),
      type: new FormControl(),
      applicationTemplate: new FormControl(),
      appName: new FormControl('', [Validators.required]),
      version: new FormControl('', [Validators.required]),
      connectedServers: this.formBuilder.array([]),
      serverInfo: new FormControl(),
      port: new FormControl(''),
      workingDirectory: new FormControl(),
      startupFlag: new FormControl(false),
      symbolicLink: new FormControl(),
      appDependency: new FormControl(false),
      dependencyType: new FormControl(''),
      appDependencyVersion: new FormControl('')
    });

    this.apiService.oneConnectAddAppData(this.data.appId).subscribe((res: any[]) => {
      res.map(item => {
        if (this.formGroup.value[item.key]) {
          // this.formGroup.controls[item.key].patchValue(item.defaultValue);
          // this.formGroup.get(item.key).patchValue(item.defaultValue);
        }
      })
    });

    const hardData = {
      "status": 0,

      "hostId": this.data.targetEnvironmentId,
      "config": {
        "appName": '',
        "appId": 0,

        "type": this.data.appId,
        "version": null,
        "state": null,
        "connectedServers": [

        ],
        "serverInfo": {
          "name": "",
          "host": "",
          "hostDBID": 257,
          "backupServerDBID": 0,
          "port": "",
          "timeout": 0,
          "attempts": 0
        },
        "workingDirectory": "",
        "options": [
          {}
        ],
        "appPrototypeDBID": '',
        "commandLine": ".",
        "startupTimeout": null,
        "shutdownTimeout": null,
        "redundancyType": "string",
        "port": '',
        "startUpFlag": true,
        "symbolicLink": "",
        "upgradeVersion": false
      },
      "appId": 0,
      "type": "ChatServer"

    };

    this.appConfig = hardData.config;


  }

  ngOnInit() {

    this.apiService.oneConnectAppVersions(this.data.appId).subscribe(
      appVersions => {
        this.appVersions = appVersions;
        this.selectedVersion = this.appVersions && this.appVersions.length > 0
          ? this.appVersions[0]
          : '';
      });

    this.apiService.getAllApps().pipe(
      switchMap(allApps => {
        this.availableServers = allApps;
        return this.apiService.oneConnectAppTemplates(this.data.appId);
      })
    ).subscribe(
      res => {
        this.allTemplates = res;
      });

    this.apiService.appPlugins().subscribe(
      res => {
        this.allPlugins = res;
      });

    this.formGroup.get('dependencyType').valueChanges.subscribe(val => {
      this.formGroup.controls.appDependencyVersion.patchValue('');
      if (!val || val === '') {
        return;
      }
      this.apiService.pluginVersions(val).subscribe(
        res => {
          this.allPluginVersions = res;
        });
    });
  }
  public onAddConnection() {

    const dialogRef = this.dialog.open(AddConnectionDialogComponent, {
      data: {
        appName: this.data.appId,
        availableServers: this.availableServers,
        connectedServers: this.formGroup.value.connectedServers
      },
      panelClass: 'mwa-dialog',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const form = this.formGroup.controls.connectedServers as FormArray;
        this.connectedServersIds = result.connectedServersIds;
        // this.appConfig.connectedServers = this.appConfig.connectedServers.filter(
        //   server => !!this.connectedServers.find(cs => cs.appId === server.appServerId)
        // );
        result.connectedServers.forEach(cs => {
          const server = this.appConfig.connectedServers.find(s => s.appServerId === cs.appId);

          if (!server) {
            form.push(this.formBuilder.group({
              appServerName: cs.appName,
              appServerId: cs.appId,
              connProtocol: cs.connectionProtocol,
              id: cs && cs.id ? cs.id : 'default',
              mode: cs.mode,
              timeoutLocal: cs.localTimeout,
              timeoutRemote: cs.remoteTimeout,
            }));
          }
        });

      }
    });
  }

  delConnServer(pos) {
    const form = this.formGroup.controls.connectedServers as FormArray;
    form.removeAt(pos);
  }


  setStartup(chck) {
    this.formGroup.controls.startupFlag.patchValue(chck);
  }

  setCheck(control, chck) {
    this.formGroup.controls[control].patchValue(chck ? 'CFGEnabled' : 'CFGDisabled');
  }

  setAppDependency(chck) {
    this.formGroup.controls.appDependency.patchValue(chck);
    if (!chck) {
      this.formGroup.controls.dependencyType.patchValue('');
      this.formGroup.controls.appDependencyVersion.patchValue('');
    }
  }

  public addApplication() {
    const formValues = this.formGroup.value;

    const dbId = this.allTemplates.filter(v => v.name === formValues.applicationTemplate);

    const newAppConfig = {
      appName: formValues.appName,
      hostId: this.data.targetEnvironmentId,
      config: {
        ...formValues,
        state: formValues.state ? 'CFGEnabled' : 'CFGDisabled',
        serverInfo: {
          name: formValues['serverInfo']
        },
        connectedServers: this.parseConnectedServers(),
        appPrototypeDBID: dbId ? dbId[0].dbid : '',
        type: this.data.appId
      }
    };

    const appName = newAppConfig.appName;
    const hostName = this.data.targetEnvironmentName;

    this.toastr.success(`Application ${appName} added to ${hostName}.`);

    this.dialogRef.close(newAppConfig);
  }

  public parseConnectedServers() {
    return this.formGroup.value.connectedServers.map(item => {
      return {
        appServerName: item.appServerName,
        appServerId: item.appServerId,
        connectionProtocol: item.connProtocol,
        id: item.id,
        longField1: 0,
        longField2: 5,
        longField3: 0,
        longField4: 0,
        longField5: 0,
        mode: item.mode,
        timeoutLocal: item.timeoutLocal,
        remoteTimeout: item.timeoutRemote
      };
    });
  }

  public onCancel() {
    this.dialogRef.close('cancel');
  }

  public dismiss() {
    this.dialogRef.close('cancel');
  }
}
