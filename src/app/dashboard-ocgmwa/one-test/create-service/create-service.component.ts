import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AutomatorApiService } from 'src/app/services/automator-api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-service',
  templateUrl: './create-service.component.html',
  styleUrls: ['./create-service.component.scss']
})
export class CreateServiceComponent implements OnInit {

  testService: FormGroup;
  beginTemplate = false;
  channelsList;

  constructor(private automatorApi: AutomatorApiService, private toastr: ToastrService, private router: Router) {
  }

  ngOnInit() { 
    this.testService = new FormGroup({
      serviceName: new FormControl(''),
      channelId: new FormControl(''),
      toPhoneNo: new FormControl(''),
    });

    this.automatorApi. listChannels().subscribe(res => {
      this.channelsList = res;
    }, err => {

    });
  }

  setChannel(id) {
    this.testService.get('channelId').patchValue(id);
  }

  saveTemplate() {

    this.automatorApi.createOneTestService(this.testService.value).subscribe(res => {
      this.toastr.success("Service successfuly created");
      this.router.navigate(['dashboard', 'onetest', 'service']);
    }, err => {
      this.toastr.error("Error occured! Try again");
    });
  }

}