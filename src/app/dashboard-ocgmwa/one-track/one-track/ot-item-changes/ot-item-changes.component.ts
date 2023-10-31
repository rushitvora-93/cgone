import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AutomatorApiService } from 'src/app/services/automator-api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ot-item-changes',
  templateUrl: './ot-item-changes.component.html',
  styleUrls: ['./ot-item-changes.component.scss']
})
export class OtItemChangesComponent implements OnInit {
  shouldShowOnlyDifference: boolean;
  config: any;
  id: any;
  objectType: string;
  envName: string;

  configurationItems: any[];
  oldConfiguration: any;
  newConfiguration: any;

  constructor(
    public dialogRef: MatDialogRef<OtItemChangesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private automatorApi: AutomatorApiService,
    private toastr: ToastrService
  ) {
    if (data) {
      this.config = this.parseConfiguration(data.value);
      this.id = data.id;
      this.objectType = data.objectType;
      this.envName = data.envName;
    }
  }

  ngOnInit() {
  }

  parseConfiguration(config) {
    let newConfigObj = {};
    let oldConfigObj = {};
    let configurationList = [];
    if (config.NewConfiguration) {
      this.addConfigurationItem(
        config.NewConfiguration,
        newConfigObj,
        ''
      );
    }
    if (config.OldConfiguration) {
      this.addConfigurationItem(
        config.OldConfiguration,
        oldConfigObj,
        ''
      );
    }

    Object.keys(newConfigObj).forEach(k => {
      if (newConfigObj[k].isObject) {
        configurationList.push({
          configKey: k,
          isObject: true
        })
      } else {
        configurationList.push({
          configKey: k,
          newConfig: newConfigObj[k].val,
          oldConfig: oldConfigObj[k] ? oldConfigObj[k].val : undefined,
          isChanged: oldConfigObj[k] ? newConfigObj[k].val !== oldConfigObj[k].val : true
        })
      }
      delete oldConfigObj[k]
    })
    Object.keys(oldConfigObj).forEach(k => {
      if (oldConfigObj[k].isObject) {
        configurationList.push({
          configKey: k,
          isObject: true
        })
      } else {
        configurationList.push({
          configKey: k,
          oldConfig: oldConfigObj[k].val,
          isChanged: true
        })
      }
    });

    this.configurationItems = configurationList;
  }

  addConfigurationItem(configuration, configObj, parentKey) {
    if (Array.isArray(configuration)) {
      configuration.forEach((val, index) => {
        if (Array.isArray(val)) {
          if (parentKey !== '') {
            configObj[parentKey + '.[' + index + ']'] = { isObject: true };
          }
          this.addConfigurationItem(val, configObj, parentKey !== '' ? parentKey + '.[' + index + ']' : '[' + index + ']');
        }
        else if (typeof val == 'object') {
          if (parentKey !== '') {
            configObj[parentKey + '.[' + index + ']'] = { isObject: true };
          }
          this.addConfigurationItem(val, configObj, parentKey !== '' ? parentKey + '.[' + index + ']' : '[' + index + ']');

        } else {
          configObj[parentKey + '.[' + index + ']'] = { val: val };
        }
      })
    }
    else if (typeof configuration == 'object') {
      Object.keys(configuration).forEach(key => {
        if (!configuration[key]) {
          configObj[parentKey !== '' ? parentKey + '.' + key : key] = { val: null };
        } else if (Array.isArray(configuration[key])) {
          if (parentKey !== '') {
            configObj[parentKey + '.' + key] = { isObject: true };
          }
          this.addConfigurationItem(configuration[key], configObj, parentKey !== '' ? parentKey + '.' + key : key);
        }
        else if (typeof configuration[key] == 'object') {
          if (parentKey !== '') {
            configObj[parentKey + '.' + key] = { isObject: true };
          }
          this.addConfigurationItem(configuration[key], configObj, parentKey !== '' ? parentKey + '.' + key : key);

        } else {
          configObj[parentKey !== '' ? parentKey + '.' + key : key] = { val: configuration[key] };
        }
      });
    }

  }
  dismiss() {
    this.dialogRef.close();
  }
}
