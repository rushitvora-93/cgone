import { Component, OnInit } from '@angular/core';
import { AutomatorApiService } from 'src/app/services/automator-api.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material';
import { OdCreateEnvComponent } from './od-create-env/od-create-env.component';

@Component({
  selector: 'app-od-virtual-env',
  templateUrl: './od-virtual-env.component.html',
  styleUrls: ['./od-virtual-env.component.scss']
})
export class OdVirtualEnvComponent implements OnInit {
  environments = [];
  constructor(private automatorApi: AutomatorApiService,
    private toastr: ToastrService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.loadEnv();
  }

  loadEnv() {
    this.automatorApi.getNewEnvList()
      .subscribe((res: []) => {
        this.environments = res;
      });
  }

  addEnv() {
    this.dialog.open(OdCreateEnvComponent, {
      autoFocus: false,
      id: 'create-env',
      panelClass: 'mwa-dialog',
      width: '480px',
      height: '600px'
    }).afterClosed().subscribe(res => {
      if (res) {
        this.loadEnv();
      }
    });
  }

}
