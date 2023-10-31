import { Component, OnInit } from '@angular/core';
import { Chart } from "chart.js";
import { AutomatorApiService } from 'src/app/services/automator-api.service';
import { environment } from 'src/environments/environment';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-promote-report-change',
  templateUrl: './promote-report.component.html',
  styleUrls: ['./promote-report.component.scss']
})
export class OneChangePromoteReportComponent implements OnInit {

  colorCodes = ['#1A3098', '#00BDC8', '#0D8F96', '#0D8F96'];
  isBusy = false;
  hasData = 0;

  searchForm: FormGroup;
  fromDateTrigger = false;
  toDateTrigger = false;
  constructor(private automatorApi: AutomatorApiService,
    private toastr: ToastrService) {
    this.searchForm = new FormGroup({
      fromDate: new FormControl(new Date()),
      toDate: new FormControl(new Date())
    })
  }

  ngOnInit() {
  }

  setDate(control, val) {
    this.searchForm.get(control).patchValue(val);
    this.fromDateTrigger = false;
    this.toDateTrigger = false;
  }

  generateReport() {
    if (this.isBusy) {
      return;
    }

    this.isBusy = true;

    this.automatorApi.getPromoteReport(
      this.searchForm.value
    ).subscribe(result => {
      this.hasData = result.length;
      this.isBusy = false;

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
      const promotedChartData = this.prepareDataForPie('promoted', result)
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
    },
      err => {
        this.isBusy = false; this.toastr.error(
          `Unable to collect the data. Check the environments are properly configured`,
          "Failed!"
        );
      }
    );
  }

  perpareDataForBar = (data) => {
    let fromSub = 11, toSub = 13;
    const isSingleDay = this.searchForm.value.fromDate.split(' ')[0] === this.searchForm.value.toDate.split(' ')[0];
    const keyValPair = data.reduce((red, d) => {
      const key = d.createdOn.substring(fromSub, toSub);
      let keydata = '';
      if (!isSingleDay) {
        keydata = d.createdOn.split(' ')[0] + ' ';
      }
      red[keydata + key] = (red[keydata + key] || 0) + 1;
      return red;
    }, {});
    return {
      labels: Object.keys(keyValPair),
      data: Object.keys(keyValPair).map(key => keyValPair[key]),
      backgroundColor: Object.keys(keyValPair).map(key => this.getRandomColor())
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
      backgroundColor: Object.keys(keyValPair).map(key => this.getRandomColor())
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
