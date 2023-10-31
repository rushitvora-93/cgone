import { Component, OnInit } from '@angular/core';
import { AutomatorApiService } from 'src/app/services/automator-api.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material';
import { OdDuplicateNvComponent } from './od-duplicate-nv/od-duplicate-nv.component';

@Component({
  selector: 'app-od-copy-env',
  templateUrl: './od-copy-env.component.html',
  styleUrls: ['./od-copy-env.component.scss']
})
export class OdCopyEnvComponent implements OnInit {

  environments = [];
  constructor(private automatorApi: AutomatorApiService,
    private toastr: ToastrService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.loadEnv();
  }

  loadEnv() {
    this.automatorApi.getCopyEnvList()
      .subscribe((res: []) => {
        this.environments = res;

      })
  }
  copyEnv() {
    this.dialog.open(OdDuplicateNvComponent, {
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
