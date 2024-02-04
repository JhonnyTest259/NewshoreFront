import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { cloneDeep } from 'lodash';
import { Flight } from 'src/app/interfaces/Flight';
import { Jorneys } from 'src/app/interfaces/Jorneys';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ResultComponent implements OnInit {
  @Input('journey') journey!: Jorneys;
  @Output('goBack') goBack: EventEmitter<boolean> = new EventEmitter();
  flightsTmp: Flight[] = [];
  monedaSelected: string = 'USD';
  totalPrice: number = 0;
  monedas: string[] = ['USD', 'EUR', 'COP'];
  constructor() {}
  ngOnInit(): void {
    // console.log(this.journey);

    this.totalPrice = this.journey.price;
    this.flightsTmp = cloneDeep(this.journey.flights);
  }

  convertCoin() {
    // console.log(this.monedaSelected);
    this.journey.price = this.totalPrice;
    this.journey.flights = cloneDeep(this.flightsTmp);
    // console.log(this.journey.flights);
    // console.log(this.flightsTmp);

    switch (this.monedaSelected) {
      case 'USD':
        this.journey.currency = 'USD';
        this.journey.price = this.journey.price;
        break;
      case 'EUR':
        this.journey.currency = 'EUR';
        this.journey.price = this.journey.price * 0.91;
        this.journey.flights.forEach((data) => {
          data.price = data.price * 0.91;
        });
        break;
      case 'COP':
        this.journey.currency = 'COP';
        this.journey.price = this.journey.price * 4526.14;
        this.journey.flights.forEach((data) => {
          data.price = data.price * 4526.14;
        });
        break;

      default:
        break;
    }
  }

  back() {
    this.goBack.emit(true);
  }
}
