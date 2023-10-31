import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.css']
})
export class CampaignComponent implements OnInit {

  @Input() campaign;
  @Output() campaignGroupClick= new EventEmitter();
  constructor() { }
  isCollapsed1=true;
  ngOnInit() {
  }

  ObjectClick(val){
    this.campaignGroupClick.emit({ dbid:this.campaign.dbid, value:val});
  }
}
