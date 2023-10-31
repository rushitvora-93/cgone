import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.css']
})
export class SwitchComponent implements OnInit {

  @Input() switch;
  @Output() dnClick = new EventEmitter();
  constructor() { }
  isCollapsed = true;
  ngOnInit() {
  }

  ObjectClick(val, showType = false) {
    this.dnClick.emit({ dbid: this.switch.dbid, value: val, showType: showType });
  }
}
