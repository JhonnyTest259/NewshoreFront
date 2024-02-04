import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Jorneys } from 'src/app/interfaces/Jorneys';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit, OnChanges {
  isBack: boolean = false;
  monedas: string[] = ['USD', 'EUR', 'COP'];
  journey?: Jorneys;
  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  ngOnInit(): void {}

  goBack(event: boolean) {
    if (event) {
      this.journey = undefined;
    }
  }
}
