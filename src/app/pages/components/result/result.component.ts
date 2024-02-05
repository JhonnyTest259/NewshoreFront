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
    const conversionFactors: any = {
      USD: 1,
      EUR: 0.91,
      COP: 4526.14,
    };

    this.journey.price = this.totalPrice;
    this.journey.flights = cloneDeep(this.flightsTmp);

    const conversionFactor = conversionFactors[this.monedaSelected];

    if (conversionFactor !== undefined) {
      this.journey.currency = this.monedaSelected;
      this.journey.price *= conversionFactor;

      this.journey.flights.forEach((data) => {
        data.price *= conversionFactor;
      });
    } else {
      // Manejar caso inesperado
      console.error('Moneda no reconocida:', this.monedaSelected);
    }
  }

  back() {
    this.goBack.emit(true);
  }
}
