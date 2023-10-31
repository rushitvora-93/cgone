import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AutomatorApiService } from 'src/app/services/automator-api.service';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-clone',
  templateUrl: './app-clone.component.html',
  styleUrls: ['./app-clone.component.scss']
})
export class AppCloneComponent implements OnInit {

  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  checked = false;
  sites = [{ 'name': 'from', id: 1 }, { 'name': 'to', id: 2 }]
  site1Hosts: any[] = []
  site2Hosts: any[] = []
  fromSite: string;
  toSite: string;
  hosts1: any[] = [];
  hosts2: any[] = [];
  mapping: any[];
  selectedHost: any;
  cloneData: { fromSite: string; toSite: string; hostList: any[]; };
  cloneSuccess = false;
  constructor(private automatorApi: AutomatorApiService,
    private toastr: ToastrService, private route: Router) { }

  ngOnInit() {

    this.getHosts();
  }


  clone() {
    let data = { fromSite: this.fromSite, toSite: this.toSite, hostList: [] }
    this.site1Hosts.forEach((h1, i) => {
      data.hostList.push({ fromHost: h1.hostName, toHost: this.site2Hosts[i].hostName })
    })

    this.automatorApi.cloneApps(data)
      .subscribe(res => {
        this.cloneData = data;
        this.mapping = res;
        this.selectedHost = res[0];
        this.toastr.success(
          "App cloned Successfully...",
          "Success!"
        );
      }, err => {
        this.toastr.error(
          `Oops...Not able to clone the application, please check the credential.`,
          "Failed!"
        );
      })


  }

  moveSite1Items(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.site1Hosts, event.previousIndex, event.currentIndex);
  }


  moveSite2Items(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.site2Hosts, event.previousIndex, event.currentIndex);

  }
  getHosts() {
    this.automatorApi.getAllHosts()
      .subscribe((res: any[]) => {
        res.forEach(r => {
          this.hosts1.push(Object.assign({}, r));
          this.hosts2.push(Object.assign({}, r))
        })

      })
  }

  filterHosts() {
    this.site1Hosts = [];
    this.site2Hosts = [];
    this.hosts1.forEach(h => {
      if (h.selected) {
        this.site1Hosts.push(Object.assign({}, h))
      }
    })
    this.hosts2.forEach(h => {
      if (h.selected) {
        this.site2Hosts.push(Object.assign({}, h))
      }
    })
  }

  save() {
    this.automatorApi.saveCloneApps(this.cloneData).subscribe(res => {
      this.toastr.success(
        "Cloned app saved Successfully...",
        "Success!"
      );

      this.cloneSuccess = true;
      setTimeout(() => { this.route.navigateByUrl('/dashboard?reload=true'); }, 3000);
    }, err => {
      this.toastr.error(
        "Error in saving clone app Successfully...",
        "Failed!"
      );
    })


  }


}
