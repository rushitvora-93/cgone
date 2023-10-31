import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges, OnChanges } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'mwa-date',
  templateUrl: './mwa-date.component.html',
  styleUrls: ['./mwa-date.component.scss']
})
export class MwaDateComponent implements OnInit, OnChanges {
  @Input() show = false;
  @Input() title = null;
  @Input() date;
  @Input() allowTime = false;
  @Input() disableInit = false;
  @Output() change = new EventEmitter<any>();
  selection: string;
  month: number;
  day: number;
  year: number;
  monthName: string;
  days = [];
  mode = 0;
  monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  showPicker = false;
  setTimeForm: FormGroup;
  constructor() {
    const date = new Date();
    this.setTimeForm = new FormGroup({
      timeHr: new FormControl(date.getHours() > 12 ? date.getHours() - 12 : date.getHours()),
      timeMin: new FormControl(date.getMinutes()),
      timeZone: new FormControl(date.getHours() > 12 ? 12 : 0),
    })
  }

  ngOnInit() {
    const date = new Date();
    this.day = date.getDate();
    this.month = date.getMonth() + 1;
    this.year = date.getFullYear();
    this.selection = this.day + '-' + this.month + '-' + this.year;
    this.setMonth();
    if (!this.disableInit) {
      setTimeout(() => this.close());
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.show) {
      this.showPicker = changes.show.currentValue;
    }
    if (changes['date'] && changes.date.currentValue !== this.selection && !changes.date.firstChange) {
      const format = changes.date.currentValue.split('-');
      if (format.length > 0) {
        const old = format[1];
        format[1] = format[0];
        format[0] = old;
      }

      const date = new Date(format);
      this.day = date.getDate();
      this.month = date.getMonth() + 1;
      this.year = date.getFullYear();
      this.selection = this.day + '-' + this.month + '-' + this.year;
      this.setMonth();
      // setTimeout(() => this.close());
    }
  }

  setMonth() {
    const days = new Date(this.year, this.month, 0).getDate();
    var pos = new Date(this.month + ' ' + 1 + ' ' + this.year).getDay();
    this.days = [];
    if (pos > 0) {
      for (let i = 0; i < pos; i++) {
        this.days.push(0);
      }
    }
    for (let i = 0; i < days; i++) {
      this.days.push(i + 1);
    }
  }

  nextMonth() {
    this.month++;
    if (this.month > 12) {
      this.month = 1;
      this.year++;
    }
    this.setMonth();
  }

  prevMonth() {
    this.month--;
    if (this.month < 1) {
      this.month = 12;
      this.year--;
    }
    this.setMonth();
  }

  pickDate(date) {
    let time = '';
    if (this.allowTime) {
      time = ' ' + (this.setTimeForm.value.timeHr + this.setTimeForm.value.timeZone) + ':' + this.setTimeForm.value.timeMin + ':00';
    }

    this.change.emit(date + '-' + this.month + '-' + this.year + time);
    this.showPicker = false;
  }

  close(emit = true) {
    let time = '';
    if (this.allowTime) {
      time = ' ' + (this.setTimeForm.value.timeHr + this.setTimeForm.value.timeZone) + ':' + this.setTimeForm.value.timeMin + ':00';
    }
    if (emit) {
      this.change.emit(this.day + '-' + this.month + '-' + this.year + time);
    } else {
      // this.change.emit(this.selection + time);
    }
    this.showPicker = false;
  }
}
