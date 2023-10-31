import { Component, OnInit } from '@angular/core';
import { AutomatorApiService } from '../services/automator-api.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-promote-report',
  templateUrl: './promote-report.component.html',
  styleUrls: ['./promote-report.component.css']
})
export class PromoteReportComponent implements OnInit {
  isLoaded = false;
  fromDate: any;
  toDate: any;
  fromHour=0;
  fromMinute=0;
  fromSecond=0;
  toHour=23;
  toMinute=59;
  toSecond=0;
  hourList = [];
  minuteList = [];
  secondList = [];
  barChart = [];
  objectTypeForChart = [];
  operationForChart = [];
  promotedForChart = [];
  userForChart = [];
  constructor(
    private automatorApi: AutomatorApiService
  ) { }

  ngOnInit() {
    const date = new Date();
    this.fromDate = date;
    this.toDate = date;
    this.isLoaded = false;

    for (let i = 1; i <= 24 ; i++) {
      this.hourList.push(i);
    }
    for (let i = 1; i <= 59 ; i++) {
      this.minuteList.push(i);
    }
    for (let i = 1; i <= 60 ; i++) {
      this.secondList.push(i);
    }
    // this.submit('');
  }

  randomScalingFactor = () => Math.round(Math.random() * 100);
  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
  }

  perpareDataForBar = (data) => {
    let fromSub = 0, toSub = 10;
    // if (this.fromDate._i && this.fromDate.getTime() === this.toDate.getTime()) {
      fromSub = 11, toSub = 13;
    // }
    const keyValPair = data.reduce((red, d) => {
      const key = d.createdOn.substring(fromSub, toSub);
      red[key] = (red[key] || 0) + 1;
      return red;
    }, {});
    // console.log('bar keyValPair>>', keyValPair);
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

  submit(value) {
    if(value == 'submitted'){
    var fromday = this.fromDate._i.date;
    var frommonth = this.fromDate._i.month+1;
    var fromyear = this.fromDate._i.year
    if(this.toDate._i){
      var today = this.toDate._i.date;
    var tomonth = this.toDate._i.month+1;
    var toyear = this.toDate._i.year
    } else {
      var today = this.toDate.getDate();
    var tomonth = this.toDate.getMonth() + 1;
    var toyear = this.toDate.getFullYear();
    }
    }
    if(value == ''){
    var fromday = this.fromDate.getDate();
    var frommonth = this.fromDate.getMonth() + 1;
    var fromyear = this.fromDate.getFullYear()
    var today = this.toDate.getDate();
    var tomonth = this.toDate.getMonth() + 1;
    var toyear = this.toDate.getFullYear()
    }
    const from = fromday +
      '-' + frommonth +
      '-' + fromyear +
      ' ' + this.fromHour +
      ':' + this.fromMinute +
      ':' + this.fromSecond;
    const to = today +
      '-' + tomonth +
      '-' + toyear +
      ' ' + this.toHour +
      ':' + this.toMinute +
      ':' + this.toSecond;
    const data = {
      'toDate': to,
      'fromDate': from
    };
    this.automatorApi.getPromoteReport(data).subscribe(result => {
          this.isLoaded = true;
          // console.log('Hi There...', result);
            const timeChartData = this.perpareDataForBar(result)
          this.barChart = new Chart('barChart', {
            type: 'bar',
            data: {
                labels: timeChartData.labels,
                datasets: [{
                    label: '# of changes',
                    data: timeChartData.data,
                    backgroundColor: timeChartData.backgroundColor,
                    borderColor: timeChartData.backgroundColor,
                    borderWidth: 1
                }]
            },
            options: {
              title: {
                display: false,
                text: '# of changes'
              },
              scales: {
                  yAxes: [{
                      ticks: {
                          beginAtZero: true,
                          stepSize: 1
                      },
                      scaleLabel: {
                        display: true,
                        labelString: '# of changes'
                      }
                  }],
                  xAxes: [{
                    maxBarThickness: 30,
                    scaleLabel: {
                      display: true,
                      labelString: 'Day hours'
                    }
                  }]
              }
            }
          });
          const objectTypeChartData = this.prepareDataForPie('objectType', result)
          this.objectTypeForChart = new Chart('objectType', {
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
          this.operationForChart = new Chart('operation', {
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
          this.promotedForChart = new Chart('promoted', {
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
          this.userForChart = new Chart('user', {
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
          console.log('we are in error..', err);
          this.isLoaded = false;
        }
      );
  }
}
