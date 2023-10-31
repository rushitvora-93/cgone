import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AutomatorApiService } from 'src/app/services/automator-api.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-od-duplicate-nv',
  templateUrl: './od-duplicate-nv.component.html',
  styleUrls: ['./od-duplicate-nv.component.scss']
})
export class OdDuplicateNvComponent implements OnInit {

  copyEnvForm: FormGroup;
  toggleChannelForm = false;
  envList = [];

  constructor(private automatorApi: AutomatorApiService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<OdDuplicateNvComponent>) {
    this.copyEnvForm = new FormGroup({
      fromEnvId: new FormControl('', [Validators.required]),
      newEnvName: new FormControl('', [Validators.required]),
      cfgUsername: new FormControl('', [Validators.required]),
      cfgPassword: new FormControl('', [Validators.required]),
      dbHost: new FormControl('', [Validators.required]),
      dbPort: new FormControl('', [Validators.required]),
      logdbUsername: new FormControl('', [Validators.required]),
      logdbPassword: new FormControl('', [Validators.required]),
      serviceName: new FormControl('', [Validators.required]),
      database: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
    this.automatorApi.getAllEnv().subscribe(res => {
      this.envList = res;
    })
  }


  create() {
    this.automatorApi.postCopyEnvApp({ ...this.copyEnvForm.value, channelVol: [] })
      .subscribe(res => {
        this.dialogRef.close(true);
        this.toastr.success(
          "Environment cloned successfully.",
          "Success!"
        );
      }, err => {
        this.toastr.error(
          "Failed to process your request. Please check inputs and try again.",
          "Error!"
        );
      });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
