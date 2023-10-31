import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AutomatorApiService } from 'src/app/services/automator-api.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-od-copy-edit-host',
  templateUrl: './od-copy-edit-host.component.html',
  styleUrls: ['./od-copy-edit-host.component.scss']
})
export class OdCopyEditHostComponent implements OnInit {
  addHostForm: FormGroup;
  osList = [];
  isEdit = false;

  hostConfig = [{
    id: 'lcaRunning',
    label: 'LCA Running'
  },
  {
    id: 'automatorAgentRunning',
    label: 'AA Running'
  },
  {
    id: 'status',
    label: 'Status'
  },
  {
    id: 'state',
    label: 'State'
  },
  {
    id: 'startupFlag',
    label: 'Startup Flag'
  }];

  formBusy = false;
  selectedEnvHost: string;

  constructor(private automatorApi: AutomatorApiService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<OdCopyEditHostComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.selectedEnvHost = data.envId;
    this.addHostForm = new FormGroup({
      hostName: new FormControl('', [Validators.required]),
      ip: new FormControl('', [Validators.required]),
      osType: new FormControl('', [Validators.required]),
      lcaRunning: new FormControl(false),
      automatorAgentRunning: new FormControl(false),
      status: new FormControl(false),
      state: new FormControl(false),
      startupFlag: new FormControl(false),
      scsDBID: new FormControl(),
      osVersion: new FormControl('', [Validators.required])
    });

    if (data.host) {
      const val = data.host.hostConfig;
      if (!val) {
        return;
      }
      this.addHostForm.setValue({
        hostName: data.host.hostName ? data.host.hostName : '',
        ip: val.ip ? val.ip : '',
        osType: val.osType ? val.osType : '',
        lcaRunning: val.lcaRunning ? val.lcaRunning : false,
        automatorAgentRunning: val.automatorAgentRunning ? val.automatorAgentRunning : false,
        status: val.status === 1 ? true : false,
        state: val.state === 'CFGEnabled' ? true : false,
        startupFlag: val.startupFlag ? true : false,
        scsDBID: val.solutionControlCenter ? val.solutionControlCenter : '',
        osVersion: val.osVersion ? val.osVersion : ''
      });
      this.isEdit = true;
    }
  }

  ngOnInit() {

    this.automatorApi.getOSList()
      .subscribe((res: any) => {
        this.osList = res.list;
      }, err => {

      });
  }


  setHostConfig(val, id) {
    this.addHostForm.get(id).patchValue(val);
  }

  saveNewHost() {
    if (this.formBusy || this.isEdit) { return; }
    this.formBusy = true;
    const param = this.addHostForm.value;
    this.automatorApi.addNewCopyHost({
      hostName: param.hostName,
      cpyId: this.selectedEnvHost,
      hostConfig: {
        automatorAgentRunning: param.automatorAgentRunning,
        hostId: 0,
        ip: param.ip,
        lcaPort: 0,
        lcaRunning: param.lcaRunning,
        options: {},
        osType: param.osType,
        solutionControlCenter: param.scsDBID,
        startupFlag: param.startupFlag,
        state: param.state ? 'CFGEnabled' : 'CFGDisabled',
        status: param.status ? 1 : 0,
        osVersion: param.osVersion
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

  editHost() {
    if (this.formBusy || !this.isEdit) { return; }
    this.formBusy = true;
    const param = this.addHostForm.value;
    this.automatorApi.addNewCopyHost({
      hostName: param.hostName,
      cfgServId: this.selectedEnvHost,
      cpyId: this.data.host.cpyId,
      id: this.data.host.id,
      installed: this.data.host.installed,
      created: this.data.host.created,
      appDetails: this.data.host.appDetails,
      hostConfig: {
        automatorAgentRunning: param.automatorAgentRunning,
        hostId: 0,
        ip: param.ip,
        lcaPort: 0,
        lcaRunning: param.lcaRunning,
        options: {},
        osType: param.osType,
        solutionControlCenter: param.scsDBID,
        startupFlag: param.startupFlag,
        state: param.state ? 'CFGEnabled' : 'CFGDisabled',
        status: param.status ? 1 : 0,
        osVersion: param.osVersion
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
