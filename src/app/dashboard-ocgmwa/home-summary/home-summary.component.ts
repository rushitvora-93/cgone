import { Component, OnInit } from '@angular/core';
import { Chart } from "chart.js";
import { AutomatorApiService } from 'src/app/services/automator-api.service';
import { environment } from 'src/environments/environment';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home-summary',
  templateUrl: './home-summary.component.html',
  styleUrls: ['./home-summary.component.scss']
})
export class HomeSummaryComponent implements OnInit {
  config = environment;

  colorCodes = ['#1A3098', '#00BDC8', '#0D8F96', '#0D8F96'];

  constructor(private automatorApi: AutomatorApiService,
    private toastr: ToastrService) {
    const d = new Date();
    const date = d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear();
    const sd = new Date(); sd.setDate(sd.getDate() - 2)
    const start = sd.getDate() + '-' + (d.getMonth() + 1) + '-' + sd.getFullYear();
    const params = { "toDate": date + ' 23:59:59', "fromDate": start + " 0:0:0", "userName": "", "operation": "", "objectType": [] };

    this.automatorApi.getPromoteReport(params)
      .pipe(
        switchMap(promotedData => {
          this.testStatus(this.perpareDataForBar(promotedData));
          const ad = new Date();
          const adate = ad.getDate() + '-' + (ad.getMonth() + 1) + '-' + ad.getFullYear()
          const aparams = { "toDate": adate + ' 23:59:59', "fromDate": adate + " 0:0:0", "userName": "", "operation": "", "objectType": [] };
          return this.automatorApi.homePageReport(aparams);
        })
      )
      .subscribe(res => {
        if (!res) {
          return;
        }
        this.serviceStatus(this.prepareDataForPie("objectType", res));
        this.userStatus(this.prepareDataForPie("user", res));
        this.auTestStatus(res);
      }, err => {
        this.toastr.error(
          `Unable to collect the data. Check the environments are properly configured`,
          "Failed!"
        );
      })

  }

  ngOnInit() {

  }

  serviceStatus(data: any) {
    new Chart("service-status", {
      type: "doughnut",
      legend: {
        display: false
      },
      data: {
        labels: data.labels,
        datasets: [
          {
            // label: "",
            data: data.data,
            borderWidth: 0,
            backgroundColor: data.backgroundColor,
            weight: 1
          }
        ]
      },
      options: {
        responsive: true,
        legend: {
          display: false
        },
        cutoutPercentage: 85,
      }
    });
  }

  userStatus(data: any) {

    new Chart("user-status", {
      type: "doughnut",
      data: {
        labels: data.labels,
        datasets: [
          {
            data: data.data,
            borderWidth: 0,
            backgroundColor: data.backgroundColor,
            weight: 2
          }
        ]
      },
      options: {
        responsive: true,
        legend: {
          position: 'right'
        },
        cutoutPercentage: 85
      }
    });
  }

  auTestStatus(data) {
    const keyValPair = data.reduce((red, d) => {
      const key = d.time.substring(0, 2);
      red[key] = (red[key] || 0) + 1;
      return red;
    }, {});
    const generate = {
      labels: Object.keys(keyValPair),
      data: Object.keys(keyValPair).map(key => keyValPair[key])
    };

    new Chart("tests-status", {
      type: "line",
      data: {
        labels: generate.labels,
        datasets: [
          {
            // label: "",
            data: generate.data,
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
  }

  testStatus(data: any) {
    new Chart("promote", {
      type: "line",
      data: {
        labels: data.labels,
        datasets: [
          {
            data: data.data,
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
  }

  prepareDataForPie = (property, data) => {
    const keyValPair = data.reduce((red, d) => {
      red[d[property]] = (red[d[property]] || 0) + 1;
      return red;
    }, {});
    return {
      labels: Object.keys(keyValPair),
      data: Object.keys(keyValPair).map(key => keyValPair[key]),
      backgroundColor: Object.keys(keyValPair).map((key, index) =>
        this.getRandomColor()
      )
    };
  };

  perpareDataForBar = (data) => {
    let fromSub = 0, toSub = 10;
    // if (this.fromDate._i && this.fromDate.getTime() === this.toDate.getTime()) {
    fromSub = 11, toSub = 13;
    // }
    const keyValPair = data.reduce((red, d) => {
      const key = d.createdOn.substring(fromSub, toSub) + ':00';
      red[key] = (red[key] || 0) + 1;
      return red;
    }, {});
    // console.log('bar keyValPair>>', keyValPair);
    return {
      labels: Object.keys(keyValPair),
      data: Object.keys(keyValPair).map(key => keyValPair[key])
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
