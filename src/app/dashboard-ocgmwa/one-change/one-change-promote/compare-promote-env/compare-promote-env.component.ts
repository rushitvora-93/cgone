import { Component, OnInit, Input } from '@angular/core';
import { AutomatorApiService } from 'src/app/services/automator-api.service';
import { AppConfigService } from 'src/app/services/app-config.service';

@Component({
  selector: 'app-compare-promote-env',
  templateUrl: './compare-promote-env.component.html',
  styleUrls: ['./compare-promote-env.component.scss']
})
export class ComparePromoteEnvComponent implements OnInit {
  @Input() compare = [];
  @Input() selectedEnv: string;

  loadingComparison = false;
  environmentComparisson: any[] = [];

  firstEnvName: string;
  secondEnvName: string;

  displayChanges = false;

  constructor(private automatorApi: AutomatorApiService,
    private appConfigService: AppConfigService) { }

  ngOnInit() {
    if (this.compare.length) {
      this.getCompareConfigEnv(this.compare[0]);
    }
  }



  getEnvsDetail(firstEnv) {
    if (firstEnv) {
      this.getEnvDetails(firstEnv.envId, (res) => {
        this.firstEnvName = res.name;
      })
    }

    if (this.selectedEnv) {
      this.getEnvDetails(this.selectedEnv, (res) => {
        this.secondEnvName = res.name;
      })
    }

  }

  getEnvDetails(envId, cb) {
    this.automatorApi.getEnvDetails(envId)
      .subscribe(res => {
        cb(res);
      })
  }

  getCompareConfigEnv(firstEnv) {
    this.getEnvsDetail(firstEnv);

    const data = {
      objectType: firstEnv.objectType,
      firstEnv: firstEnv.envId,
      secondEnv: this.selectedEnv,
      objectName: firstEnv.objectName
    };

    this.loadingComparison = true;
    this.automatorApi.postcompareEnv(data).subscribe(

      result => {
        if (!result || !result[0]) {
          this.loadingComparison = false;
          return;
        }
        const nv1 = result[0].objDifference.map.Env1;
        const nv2 = result[0].objDifference.map.Env2;
        this.environmentComparisson = this.appConfigService.
          compareEnvironments(nv1, nv2, result[0].ignoreFieldList || []);
        this.loadingComparison = false;
      },
      err => {
        this.loadingComparison = false;
      }
    );
  }

}
