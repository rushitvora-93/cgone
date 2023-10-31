import { Component, OnInit } from '@angular/core';
import { AutomatorApiService } from 'src/app/services/automator-api.service';
import { ActivatedRoute } from '@angular/router';
import { SprintData } from 'src/app/store/store/one-test.store';
import { interval, Observable, Subscription, BehaviorSubject } from 'rxjs';
import { take, switchMap } from 'rxjs/operators';
import { DashboardService } from 'src/app/services/behaviour.service';
import { ToastrService } from 'ngx-toastr';
import { Chart } from "chart.js";

@Component({
  selector: 'app-sprint-details',
  templateUrl: './sprint-details.component.html',
  styleUrls: ['./sprint-details.component.scss']
})
export class SprintDetailsComponent implements OnInit {
  sprintData = [];
  sprintIVRData = [];
  sprintMetaData: any;
  sprintId = null;
  busy = false;
  stopInterval = true;
  isStartBusy = false;
  sprintType: any;
  audioId: any;
  msbapAudioUrl : any;

  refreshListener: Subscription;

  constructor(private automatorApi: AutomatorApiService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    public sprint: DashboardService) { }

  ngOnInit() {
    const sprintID = this.route.snapshot.params.id;
    this.sprintId = sprintID;
    this.sprintDetails();
  }

  sprintDetails() {
    this.sprint.sprintSource.subscribe(response => {
      this.sprintType = response['testType'];
    });
  }

  refreshData() {
    this.automatorApi.refreshSprint().pipe(take(1)).pipe(
      switchMap(res => {
        this.sprintData = [];
        Object.entries(res).forEach(k => {
          this.sprintData.push({ 'label': k[0], 'val': k[1] });
        });

        return this.automatorApi.oneTestSprintMeta(this.sprintId);
      })
    )
      .subscribe((res) => {
        this.sprintMetaData = res;
      }, err => {

      });
  }


  refreshIVRData(id) {
    this.automatorApi.refreshIVRSprint(id).subscribe((res) => {
      this.sprintIVRData = [];
      this.sprintIVRData = [res];
      const ivrSprintData = this.perpareDataForBar(res);
      new Chart("ivr-testing", {
        type: "line",
        data: {
          labels: ivrSprintData.labels,
          datasets: [
            {
              data: ivrSprintData.data,
              label: '# of changes',
              borderColor: '#00BDC8',
              backgroundColor: '#ffffff'
            }
          ]
        },
        options: {
          responsive: true,
          legend: {
            display: true,
            position: 'top',
            align: 'center',
            text: 'Confidence'
          },
          scales: {
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Record'
              }
            }],
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Confidence'
              }
            }]
          }  
        }
      });
    }, err => {

    });
  }

  perpareDataForBar(data) {
    let keydata = {};
    for (let index = 0; index < data.length; index++) {
      keydata[index + 1] = data[index]['confidence'];
    }
    return {
      labels: Object.keys(keydata),
      data: Object.keys(keydata).map(key => keydata[key]),
      backgroundColor: Object.keys(keydata).map(key => this.getRandomColor())
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

  downloadAudioFile(item) {
    window.open('http://demo.onecg.cc:8901/api/v2/temporary/getAudio/'+this.audioId);
    this.toastr.success("Audio Downloaded Successfully");
  }

  compareText(item) {
    const actualText = item.ivr_message;
    const expectedText = item.expected;
    const finalResult = '<label>';
    let finalString = '';
    for (let char = 0; char < expectedText.length; char++) {
      if(expectedText[char] !== actualText[char]){
        if(actualText[char] != undefined){
          finalString = finalString + '<span class="red">' + actualText[char] + '</span>' + '<span class="green">' + expectedText[char] + '</span>';
        } else {
          finalString = finalString + expectedText[char];
        }
      } else{
        finalString = finalString + expectedText[char];
      }
    }
    return finalResult + finalString + '</label>';
  } 

  startIVRSprint() {
    if (!this.stopInterval) {
      return;
    }
    this.isStartBusy = true;
    this.automatorApi.startIVRSprint(this.sprintId).subscribe(res => {
      this.audioId = res;
      this.msbapAudioUrl = 'http://demo.onecg.cc:8901/api/v2/temporary/getAudio/'+this.audioId;
      this.refreshListener = interval(5000).subscribe(res => {
        this.refreshIVRData(this.audioId);
      });
      this.stopInterval = false;
      this.isStartBusy = false;
    }, err => {
      this.isStartBusy = false;
    })
  }

  startSprint() {
    if (!this.stopInterval) {
      return;
    }
    this.isStartBusy = true;
    this.automatorApi.startSprintById(this.sprintId).subscribe(res => {
      this.refreshListener = interval(2000).subscribe(res => {
        this.refreshData();
      });

      this.stopInterval = false;
      this.isStartBusy = false;
    }, err => {
      this.isStartBusy = false;
    })
  }

  stopIVRSprint() {
    this.stopInterval = true;
    this.refreshListener.unsubscribe();
  }

  stopSprint() {
    this.automatorApi.stopSprintById(this.sprintId).subscribe(res => {
      this.stopInterval = true;
      this.refreshListener.unsubscribe();
    })
  }

  ngOnDestroy() {
    this.stopInterval = true;
    if (this.refreshListener) {
      this.refreshListener.unsubscribe();
    }
  }

}
