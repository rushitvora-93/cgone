import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-mwa-switch',
  templateUrl: './mwa-switch.component.html',
  styleUrls: ['./mwa-switch.component.scss']
})
export class MwaSwitchComponent implements OnInit {

  @Input() check = false;
  @Output() change = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit() {
  }

  toggle() {
    this.check = !this.check;
    this.change.emit(this.check);
  }

}
