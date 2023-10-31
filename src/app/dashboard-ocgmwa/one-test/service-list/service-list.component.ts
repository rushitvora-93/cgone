import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AutomatorApiService } from 'src/app/services/automator-api.service';
import { OnetestService } from 'src/app/store/service/one-test.service';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss']
})
export class ServiceListComponent implements OnInit {

  busy = true;
  allServiceList = [];
  filterResults = [];

  searchInput: FormControl;

  constructor(private automatorApi: AutomatorApiService) { }

  ngOnInit() {
    this.searchInput = new FormControl('');

    this.automatorApi.getOneTestServiceList().subscribe(res => {
      this.allServiceList = res;
      this.filterResults = res;
      this.busy = false;
    }, err => {

    });

    this.searchInput.valueChanges.subscribe(val => {
      this.filterResults = this.allServiceList.filter(item => item.serviceName.toLowerCase().startsWith(val.toLowerCase()));
    })
  }

  delete(id) {
    this.automatorApi.deleteService(id).subscribe(res => {
      this.allServiceList = this.allServiceList.filter(res => res.id != id);
      this.filterResults = this.allServiceList;
    }, err => {

    });
  }

}

