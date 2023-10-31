import { Component, OnInit } from '@angular/core';
import { OneCGQuery } from 'src/app/store/query/one-test.query';
import { AutomatorApiService } from 'src/app/services/automator-api.service';
import { OnetestService } from 'src/app/store/service/one-test.service';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { DashboardService } from 'src/app/services/behaviour.service';

@Component({
  selector: 'app-one-test',
  templateUrl: './one-test.component.html',
  styleUrls: ['./one-test.component.scss']
})
export class OneTestComponent implements OnInit {

  busy = true;
  allSprintList = [];
  filterResults = [];

  searchInput: FormControl;

  constructor(private automatorApi: AutomatorApiService, 
    private OneCGQuery: OneCGQuery, 
    private onetestService: OnetestService, 
    private subject: DashboardService) { }

  ngOnInit() {
    this.searchInput = new FormControl('');

    this.automatorApi.getOneTestSprint().subscribe(res => {
      this.allSprintList = res;
      this.filterResults = res;
      this.busy = false;
    }, err => {

    });

    this.searchInput.valueChanges.subscribe(val => {
      this.filterResults = this.allSprintList.filter(item => item.sprintName.toLowerCase().startsWith(val.toLowerCase()));
    })
  }

  showActive(filter) {
    if (filter) {
      this.filterResults = this.allSprintList.filter(item => item.status === 'Pending');
    } else {
      this.filterResults = this.allSprintList;
    }
  }

  sprintClicked(item){
    this.subject.setSprint(item);
  }

}
