import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() fit = false;
  @Input() padding = 20;

  constructor() { }

  ngOnInit() {
  }

}
