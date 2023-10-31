import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AutomatorApiService } from 'src/app/services/automator-api.service';
import { OnetestService } from 'src/app/store/service/one-test.service';

@Component({
  selector: 'app-script-list',
  templateUrl: './script-list.component.html',
  styleUrls: ['./script-list.component.scss']
})
export class ScriptListComponent implements OnInit {

  busy = true;
  allScriptList = [];
  filterResults = [];

  searchInput: FormControl;

  constructor(private automatorApi: AutomatorApiService) { }

  ngOnInit() {
    this.searchInput = new FormControl('');

    this.automatorApi.getOneTestTemplates().subscribe(res => {
      this.allScriptList = res;
      this.filterResults = res;
      this.busy = false;
    }, err => {

    });

    this.searchInput.valueChanges.subscribe(val => {
      this.filterResults = this.allScriptList.filter(item => item.scriptName.toLowerCase().startsWith(val.toLowerCase()));
    })
  }

  delete(id) {
    this.automatorApi.delTestScript(id).subscribe(res => {
      this.allScriptList = this.allScriptList.filter(res => res.id != id);
      this.filterResults = this.allScriptList;
    }, err => {

    });
  }

}

