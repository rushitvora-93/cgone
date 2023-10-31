import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AutomatorApiService } from 'src/app/services/automator-api.service';
import { HostService } from 'src/app/services/host.service';
import { ToastrService } from 'ngx-toastr';
import { DataTransferService } from 'src/app/services/data-transfer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-host',
  templateUrl: './add-host.component.html',
  styleUrls: ['./add-host.component.scss']
})
export class AddHostComponent implements OnInit {
  form: FormGroup;
  osTypes = [];
  sc = [];

  isBusy = false;

  constructor(private fb: FormBuilder,
    private automatorApi: AutomatorApiService,
    private hostService: HostService,
    private dataTransferService: DataTransferService,
    private toastr: ToastrService,
    private route: Router) {
    this.form = fb.group({
      hostName: ['', Validators.required],
      ip: ['', Validators.required],
      username: [''],
      password: [''],
      osType: ['', Validators.required],
      version: ['', Validators.required],
      lcaPort: ['', Validators.required],
      solutionControlCenter: ['', Validators.required],
      startUpflag: [''],
      state: ['']
    });
  }

  ngOnInit() {
    this.automatorApi.getAllOSType().subscribe(response => {
      this.osTypes = response.list;
    });

    this.automatorApi.getAllSC().subscribe(response => {
      this.sc = response.list;
    });
  }

  addHost() {
    const hostDataToSave = {
      ...this.form.value,
      'state': this.form.value.state ? 'CFGEnabled' : 'CFGDisabled'
    };
    this.isBusy = true;
    this.hostService.saveNewHost([hostDataToSave])
      .subscribe(
        response => {
          if (response[0].status) {
            this.toastr.error(`Error occured... not able to add the host, error: ${response[0].reason}`, 'Oops!');
          } else {
            this.toastr.success(`Host ${response[0].hostName} added successfully!!`, 'Success!');
            this.dataTransferService.changeNewHostActivity({ action: 'save', data: response[0] });
            this.route.navigateByUrl('/dashboard?active-env=new');
          }
          this.isBusy = false;
        },
        err => {
          this.toastr.error('Add new host failed.', 'Error');
          this.isBusy = false;
        });
  }

}
