import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'mwa-check',
  templateUrl: './mwa-check.component.html',
  styleUrls: ['./mwa-check.component.scss']
})
export class MwaCheckComponent implements OnInit {
  @Input() check: boolean;
  @Input() disable = false;
  @Input() color = 'primary';
  @Input() shape = '';
  @Output() change = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  update() {
    if (this.disable) {
      return;
    }
    this.check = !this.check;
    this.change.emit(this.check);
  }


}
