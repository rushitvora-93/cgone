import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AutomatorApiService } from 'src/app/services/automator-api.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { AddConnServerComponent } from './add-conn-server/add-conn-server.component';

@Component({
  selector: 'app-od-add-app',
  templateUrl: './od-add-app.component.html',
  styleUrls: ['./od-add-app.component.scss']
})
export class OdAddAppComponent implements OnInit {
  addAppForm: FormGroup;
  connectedServers = [];
  types = [];
  versions = [];
  formBusy = false;
  selectedEnvHost: string;
  appId: string;
  allPluginVersions = [];
  allPlugins = [];

  constructor(private automatorApi: AutomatorApiService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<OdAddAppComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog) {

    this.selectedEnvHost = data.envId;
    this.appId = data.appId;

    this.addAppForm = new FormGroup({
      appName: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      version: new FormControl(),
      state: new FormControl('CFGDisabled'),
      workingDirectory: new FormControl(),
      port: new FormControl(),
      appDependency: new FormControl(false),
      dependencyType: new FormControl(''),
      appDependencyVersion: new FormControl('')
    })
  }

  ngOnInit() {
    this.automatorApi.getallapptype().subscribe((data: any) => {
      data.list.forEach(item => {
        this.types.push(item.propertyName)
      });
      this.types.sort();
    }, err => {
      this.toastr.error(
        `Unable to fetch types.`,
        "Failed!"
      );
    });

    this.automatorApi.appPlugins().subscribe(
      res => {
        this.allPlugins = res;
      });

    this.addAppForm.get('dependencyType').valueChanges.subscribe(val => {
      this.addAppForm.controls.appDependencyVersion.patchValue('');
      if (!val || val === '') {
        return;
      }
      this.automatorApi.pluginVersions(val).subscribe(
        res => {
          this.allPluginVersions = res;
        });
    });
  }

  loadVersion() {
    this.versions = [];
    this.automatorApi.getVerList(this.addAppForm.value.type).subscribe(res => {
      this.versions = res;
    }, err => {
      this.toastr.error(
        `Error while fetching version list.`,
        "Failed!"
      );
    })
  }

  addConnServDialog() {
    this.dialog.open(AddConnServerComponent, {
      panelClass: 'mwa-dialog',
      autoFocus: false,
      width: '380px',
      data: {
        appName: null
      },
    }).afterClosed().subscribe(res => {
      if (res) {
        this.connectedServers.push(res);
      }
    });
  }

  delConn(pos) {
    this.connectedServers.splice(pos, 1);
  }

  setState(checked) {
    this.addAppForm.get('state').patchValue(checked ? "CFGEnabled" : "CFGDisabled");
  }
  setAppDependency(chck) {
    this.addAppForm.controls.appDependency.patchValue(chck);
    if (!chck) {
      this.addAppForm.controls.dependencyType.patchValue('');
      this.addAppForm.controls.appDependencyVersion.patchValue('');
    }
  }

  saveNewApp() {
    if (this.formBusy) { return; }
    this.formBusy = true;
    const param = this.addAppForm.value;

    this.automatorApi.addNewEnvHostApp({
      hostId: this.selectedEnvHost,
      id: this.appId,
      appName: param.appName,
      appConfig: {
        appId: this.appId,
        appName: param.appName,
        port: param.port,
        state: param.state,
        type: param.type,
        workingDirectory: param.workingDirectory,
        version: param.version,
        connectedServers: this.connectedServers,
        appDependency: param.appDependency,
        dependencyType: param.dependencyType,
        appDependencyVersion: param.appDependencyVersion
      }
    })
      .subscribe(res => {
        this.formBusy = false;
        this.toastr.success(
          "New Environment Host Created Successfully...",
          "Success!"
        );
        this.closeDialog(true);
      }, err => {
        this.formBusy = false;
        this.toastr.error(
          `Oops...Not able to create Environment Host.`,
          "Failed!"
        );
      });
  }

  closeDialog(res = false) {
    this.dialogRef.close(res);
  }
}
