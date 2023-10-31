import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AutomatorApiService } from 'src/app/services/automator-api.service';
import { switchMap, map, bufferCount, filter } from 'rxjs/operators';
import { FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { OtItemChangesComponent } from './ot-item-changes/ot-item-changes.component';
import { Chart } from "chart.js";
import { fromEvent, Observable, timer, interval } from 'rxjs';

@Component({
  selector: 'app-one-track',
  templateUrl: './one-track.component.html',
  styleUrls: ['./one-track.component.scss']
})
export class OneTrackComponent implements OnInit {

  searchTrack: FormGroup;
  isBusy = false;
  isLoaded = false;

  envList = [];
  objectList = [];

  listOfChanges = [];

  selectAllObject = false;
  operationList = [{
    id: 'ObjectUpdated',
    label: 'Updated'
  },
  {
    id: 'ObjectDeleted',
    label: 'Deleted'
  },
  {
    id: 'ObjectCreated',
    label: 'Created'
  }];

  fromDateTrigger = false;
  toDateTrigger = false;

  hasDataChart = false;

  selectedItems = [];
  togglePanel = false;

  constructor(private toastr: ToastrService,
    private automatorApi: AutomatorApiService,
    private dialog: MatDialog) {
    this.searchTrack = new FormGroup({
      envName: new FormControl(''),
      fromDate: new FormControl(new Date()),
      operation: new FormControl(),
      toDate: new FormControl(new Date()),
      userName: new FormControl('')
    })
  }

  ngOnInit() {
    this.automatorApi.getAllEnv().pipe(
      switchMap(envList => {
        this.envList = envList.map(res => ({
          value: res.id,
          label: res.appName
        }));
        return this.automatorApi.getObjectType();
      })
    )
      .subscribe(result => {
        this.objectList = result.list.map(res => ({
          value: res.mappedName,
          label: res.propertyName,
          checked: true
        }));

      });
  }


  clickCounter(user) {
    const clickCount = 2;
    const clickTimespan = 1000;
    const listner = fromEvent(document, 'click').pipe(
      map(() => new Date().getTime()),
      bufferCount(clickCount, 1)
    ).subscribe(timestamps => {
      if (timestamps[0] > new Date().getTime() - clickTimespan) {
        this.searchTrack.controls.userName.patchValue(user);
      }
      listner.unsubscribe();
    })

  }

  setSelectAllObject(check) {
    this.selectAllObject = check;
    if (check) {
      this.objectList.map(item => {
        item.checked = true;
        return item;
      });
    } else {
      this.objectList.map(item => {
        item.checked = false;
        return item;
      });
    }
  }

  setDate(control, val) {
    this.searchTrack.get(control).patchValue(val);
    this.fromDateTrigger = false;
    this.toDateTrigger = false;
  }
  get selectedObjectListCount() {
    const list = this.objectList.filter(item => item.checked);
    return (list.length ? list[0].label : 'No items selected.') + (list.length > 1 ? `+ ${list.length - 1} items` : '');
  }

  getResults() {
    if (this.isBusy) {
      return;
    }
    this.isBusy = true;
    this.isLoaded = false;
    const objectType = [];
    this.selectedItems = [];
    this.objectList.reduce((data, item) => {
      if (item.checked) {
        objectType.push(item.value);
      }
    });

    const data = {
      ...this.searchTrack.value,
      objectType: objectType,
      fromDate: this.searchTrack.value.fromDate,
      toDate: this.searchTrack.value.toDate
    };
    this.listOfChanges = [];
    this.automatorApi.postAuditHistory(data).subscribe(
      result => {
        this.listOfChanges = result;
        this.isBusy = false;
        this.isLoaded = true;
        this.hasDataChart = result.length;
        if (this.hasDataChart) {
          setTimeout(() => this.generateReport(result));
        }

      }, err => {
        this.isBusy = false;
      });
  }

  showChanges(item) {
    this.dialog.open(OtItemChangesComponent, {
      data: {
        value: item.value, id: item.id, objectType: item.objectType, envName: item.envName
      },
      width: "900px",
      height: "650px",
      panelClass: 'mwa-dialog',
      autoFocus: false
    });
  }

  selectRollback(index, val) {
    const found = this.selectedItems.indexOf(index);
    if (val) {
      if (found < 0) {
        this.selectedItems.push(index);
      }
    } else {
      if (found > -1) {
        this.selectedItems.splice(index, 1);
      }
    }
  }

  rollbackSelected() {
    this.selectedItems.map((index, key) => {
      const item = this.listOfChanges[index];
      let toast = false;
      if (key === this.selectedItems.length - 1) {
        toast = true;
      }
      this.rollBack(item.id, item.envName, toast);
    });

  }

  rollBack(id, env, toast = true) {
    this.automatorApi
      .postAuditRollback([id], env)
      .subscribe(result => {
        if (toast) {
          this.toastr.success('Rollback Successfully...', 'Success!');
          this.getResults();
        }
      },
        err => {
          this.toastr.error('Rollback Failed...', 'Fail!');
        });
  }

  stopPropogation(event) {
    event.stopPropogation();
  }


  generateReport(result) {
    // if (this.isBusy) {
    //   return;
    // }

    // this.isBusy = true;

    // this.automatorApi.getPromoteReport({
    //   fromDate: this.searchTrack.value.fromDate,
    //   toDate: this.searchTrack.value.toDate
    // }).subscribe(result => {

    const timeChartData = this.perpareDataForBar(result);

    new Chart("chart-changes", {
      type: "line",
      data: {
        labels: timeChartData.labels,
        datasets: [
          {
            // label: "",
            data: timeChartData.data,
            label: '# of changes',
            borderColor: '#00BDC8',
            backgroundColor: '#ffffff'
          }
        ]
      },
      options: {
        responsive: true,
        legend: {
          display: false
        }
      }
    });

    const objectTypeChartData = this.prepareDataForPie('objectType', result);
    new Chart('chart-types', {
      type: 'doughnut',
      data: {
        labels: objectTypeChartData.labels,
        datasets: [{
          data: objectTypeChartData.data,
          backgroundColor: objectTypeChartData.backgroundColor,
        }],
      },
      options: {
        cutoutPercentage: 85,
        responsive: true,
        legend: {
          position: 'left',
        },
        title: {
          display: false,
          text: 'Object Type'
        },
        animation: {
          animateScale: true,
          animateRotate: true
        }
      }
    });
    const operationChartData = this.prepareDataForPie('operation', result)
    new Chart('chart-operations', {
      type: 'doughnut',
      data: {
        datasets: [{
          data: operationChartData.data,
          backgroundColor: operationChartData.backgroundColor,
        }],
        labels: operationChartData.labels
      },
      options: {
        cutoutPercentage: 85,
        responsive: true,
        legend: {
          position: 'left',
        },
        title: {
          display: false,
          text: 'Operation'
        },
        animation: {
          animateScale: true,
          animateRotate: true
        }
      }
    });
    const promotedChartData = this.prepareDataForPie('rollback', result)
    new Chart('chart-promoted', {
      type: 'doughnut',
      data: {
        datasets: [{
          data: promotedChartData.data,
          backgroundColor: promotedChartData.backgroundColor,
        }],
        labels: promotedChartData.labels
      },
      options: {
        cutoutPercentage: 85,
        responsive: true,
        legend: {
          position: 'left',
        },
        title: {
          display: false,
          text: 'Promoted'
        },
        animation: {
          animateScale: true,
          animateRotate: true
        }
      }
    });
    const userChartData = this.prepareDataForPie('user', result)
    new Chart('chart-users', {
      type: 'doughnut',
      data: {
        datasets: [{
          data: userChartData.data,
          backgroundColor: userChartData.backgroundColor,
        }],
        labels: userChartData.labels
      },
      options: {
        cutoutPercentage: 85,
        responsive: true,
        legend: {
          position: 'left',
        },
        title: {
          display: false,
          text: 'User'
        },
        animation: {
          animateScale: true,
          animateRotate: true
        }
      }
    });
    // },
    //   err => {
    //     this.isBusy = false; this.toastr.error(
    //       `Unable to collect the data. Check the environments are properly configured`,
    //       "Failed!"
    //     );
    //   }
    // );
  }

  perpareDataForBar = (data) => {
    let fromSub = 11, toSub = 13;
    let d1 = this.searchTrack.value.fromDate.split(' ')[0];
    let d2 = this.searchTrack.value.toDate.split(' ')[0];
    const isSingleDay = d1 === d2;

    let initData = {};
    const keySet: any[] = [];
    if (!isSingleDay) {
      d1 = new Date(d1.split('-').reverse());
      d2 = new Date(d2.split('-').reverse());
      const key1 = (d1.getDate() > 9 ? '' : '0') + d1.getDate() + '/' + (d1.getMonth() > 8 ? '' : '0') + (d1.getMonth() + 1) + '/' + d1.getFullYear();
      const key2 = (d2.getDate() > 9 ? '' : '0') + d2.getDate() + '/' + (d2.getMonth() > 8 ? '' : '0') + (d2.getMonth() + 1) + '/' + d2.getFullYear();
      initData[key1] = 0;
      initData[key2] = 0;
      keySet.push(key1);
      keySet.push(key2);
    }

    const keyValPair = data.reduce((red, d) => {
      const key = isSingleDay ? d.time.substring(0, 2) : d.date;
      if (!keySet[key]) {
        keySet.push(key);
      }
      red[key] = (red[key] || 0) + 1;
      return red;
    }, initData);

    keySet.sort((a: any, b: any) =>
      new Date(a.split('/').reverse().join('/')).valueOf() - new Date(b.split('/').reverse().join('/')).valueOf()
    );
    const reorderKeyValPair = [];
    keySet.map(val => {
      reorderKeyValPair[val] = keyValPair[val];
    });
    return {
      labels: Object.keys(reorderKeyValPair),
      data: Object.keys(reorderKeyValPair).map(key => reorderKeyValPair[key]),
      backgroundColor: Object.keys(reorderKeyValPair).map(key => this.getRandomColor())
    };
  }

  prepareDataForPie = (property, data) => {
    const keyValPair = data.reduce((red, d) => {
      red[d[property]] = (red[d[property]] || 0) + 1;
      return red;
    }, {});
    return {
      labels: Object.keys(keyValPair),
      data: Object.keys(keyValPair).map(key => keyValPair[key]),
      backgroundColor: Object.keys(keyValPair).map(key =>
        this.getRandomColor()
      )
    };
  }

  getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

}
