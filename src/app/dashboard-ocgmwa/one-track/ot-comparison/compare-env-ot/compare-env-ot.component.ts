import { Component, OnInit, Input } from '@angular/core';
import { AutomatorApiService } from 'src/app/services/automator-api.service';
import { AppConfigService } from 'src/app/services/app-config.service';

@Component({
  selector: 'app-compare-env-ot',
  templateUrl: './compare-env-ot.component.html',
  styleUrls: ['./compare-env-ot.component.scss']
})
export class CompareEnvOtComponent implements OnInit {

  @Input() compare: any;

  loadingComparison = false;
  environmentComparisson: any[] = [];

  displayChanges = false;

  constructor(private automatorApi: AutomatorApiService,
    private appConfigService: AppConfigService) { }

  ngOnInit() {
    console.log(this.compare)
    if (this.compare) {
      this.getCompareConfigEnv(this.compare);
    }
  }

  getCompareConfigEnv(param) {
    const data = {
      objectType: param.objectType,
      firstEnv: param.firstEnv,
      secondEnv: param.secondEnv,
      objectName: param.objectName
    };

    this.environmentComparisson = [];

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
