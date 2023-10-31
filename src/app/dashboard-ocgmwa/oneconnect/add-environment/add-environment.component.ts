import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AutomatorApiService } from 'src/app/services/automator-api.service';
import { OnetestService } from 'src/app/store/service/one-test.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-environment',
  templateUrl: './add-environment.component.html',
  styleUrls: ['./add-environment.component.scss']
})
export class AddEnvironmentComponent implements OnInit {

  addEnvironment: FormGroup;

  constructor(private automatorApi: AutomatorApiService, private onetestService: OnetestService, private toastr: ToastrService, private route: Router) { }

  ngOnInit() {
    this.addEnvironment = new FormGroup({
      appName: new FormControl('', Validators.required),
      host: new FormControl('', Validators.required),
      port: new FormControl('', Validators.required),
      clientName: new FormControl('', Validators.required),
      user: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  addEnv() {
    this.automatorApi.loginEnvironment(this.addEnvironment.value).subscribe(
      response => {
        this.onetestService.addEnv(this.addEnvironment.value);
        this.route.navigateByUrl('/dashboard?active-env=new');

        this.toastr.success(
          "New Environment Loaded Successfully...",
          "Success!"
        );
      },
      err => {
        this.toastr.error(
          `Oops...Not able to load environment, please check the credential.`,
          "Failed!"
        );
      }
    );
  }

}
