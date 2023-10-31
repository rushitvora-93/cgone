import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-mwa-radio',
  templateUrl: './mwa-radio.component.html',
  styleUrls: ['./mwa-radio.component.scss']
})
export class MwaRadioComponent implements OnInit {

  @Input() check: boolean;
  @Output() change = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  update() {
    this.check = !this.check;
    this.change.emit(this.check);
  }

}
