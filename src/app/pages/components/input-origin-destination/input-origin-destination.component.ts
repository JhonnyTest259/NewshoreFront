import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { cloneDeep } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Flight } from 'src/app/interfaces/Flight';
import { Flights } from 'src/app/interfaces/Flights';
import { Jorneys } from 'src/app/interfaces/Jorneys';
import { serviceType } from 'src/app/interfaces/service.type';
import { ServicesService } from 'src/app/services/services.service';

@Component({
  selector: 'app-input-origin-destination',
  templateUrl: './input-origin-destination.component.html',
  styleUrls: ['./input-origin-destination.component.scss'],
})
export class InputOriginDestinationComponent implements OnInit {
  @Output('journeyComplete') journeyComplete: EventEmitter<Jorneys> =
    new EventEmitter();
  flightData: Flights[] = [];
  journey!: Jorneys;
  flights: Flight[] = [];
  jorneyForm!: FormGroup;
  totalPrice: number = 0;
  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private _service: ServicesService
  ) {}
  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.jorneyForm = this.fb.group({
      origin: ['', [Validators.required, Validators.minLength(3)]],
      destination: ['', [Validators.required, Validators.minLength(3)]],
      numberFlights: [null],
    });

    this.jorneyForm.get('origin')?.valueChanges.subscribe((value) => {
      this.jorneyForm.patchValue(
        { origin: value?.toUpperCase() ?? '' },
        { emitEvent: false }
      );
    });
    this.jorneyForm.get('destination')?.valueChanges.subscribe((value) => {
      this.jorneyForm.patchValue(
        { destination: value?.toUpperCase() ?? '' },
        { emitEvent: false }
      );
    });
  }

  async sendSearch() {
    if (
      this.jorneyForm.get('origin')?.value ==
      this.jorneyForm.get('destination')?.value
    ) {
      this.toast.warning('Los campos no pueden contener el mismo valor ');
      this.jorneyForm.reset();
      return;
    }

    this.jorneyForm.get('origin')?.disable();
    this.jorneyForm.get('destination')?.disable();
    await this.loadData();
    this.searchFlights();
    // console.log(this.jorneyForm);
  }
  loadData() {
    return new Promise((resolve) => {
      try {
        this._service
          .getFlights(serviceType.multipleRoutesAndReturn)
          .subscribe((response: Flights | null) => {
            this.flightData = [];
            if (response != null) {
              this.flightData = this.flightData.concat(response);
              // console.log(this.flightData);
              if (this.flightData.length != [].length) resolve('OK');
            } else {
              this.cleanAll();
              this.toast.error('El servicio no se encuentra disponible');
            }
          });
      } catch (error) {
        console.error(error);
      }
    });
  }

  searchFlights() {
    // console.log(this.flightData);
    let flightDataTmp: Flights[] = [];
    this.flights = [];
    flightDataTmp = this.flightData.filter(
      (filt) => filt.departureStation == this.jorneyForm.get('origin')?.value
    );

    flightDataTmp.forEach((datatmp) => {
      if (
        datatmp.departureStation == this.jorneyForm.get('origin')?.value &&
        datatmp.arrivalStation == this.jorneyForm.get('destination')?.value
      ) {
        this.flights.push({
          transport: {
            flightCarrier: datatmp.flightCarrier,
            flightNumber: datatmp.flightNumber,
          },
          origin: datatmp.departureStation,
          destination: datatmp.arrivalStation,
          price: datatmp.price,
        });
      }
    });
    if (this.flights.length == [].length) {
      let ruta: Flights[] = [];
      const vuelosPorSalida = new Map<string, Flights[]>();
      const vuelosPorLlegada = new Map<string, Flights[]>();
      this.flightData.forEach((vuelo) => {
        if (!vuelosPorSalida.has(vuelo.departureStation)) {
          vuelosPorSalida.set(vuelo.departureStation, []);
        }
        vuelosPorSalida.get(vuelo.departureStation)?.push(vuelo);

        if (!vuelosPorLlegada.has(vuelo.arrivalStation)) {
          vuelosPorLlegada.set(vuelo.arrivalStation, []);
        }
        vuelosPorLlegada.get(vuelo.arrivalStation)?.push(vuelo);
      });

      interface Nodo {
        vuelo: Flights;
        padre?: Nodo;
      }

      const visitados = new Set<string>();
      const cola: Nodo[] = [];

      vuelosPorSalida
        .get(this.jorneyForm.get('origin')?.value)
        ?.forEach((vuelo) => {
          cola.push({ vuelo });
        });

      while (cola.length > 0) {
        const nodoActual = cola.shift();
        const vueloActual = nodoActual?.vuelo;

        if (
          vueloActual?.arrivalStation ===
          this.jorneyForm.get('destination')?.value
        ) {
          // Se encontró una ruta
          ruta = [];
          let nodo = nodoActual;
          while (nodo?.padre) {
            ruta.unshift(nodo.vuelo);
            nodo = nodo.padre;
          }
          ruta.unshift(nodo!.vuelo);
        } else {
          visitados.add(vueloActual?.departureStation!);
          const vuelosSiguientes =
            vuelosPorSalida.get(vueloActual?.arrivalStation!) || [];
          vuelosSiguientes.forEach((vueloSiguiente) => {
            if (!visitados.has(vueloSiguiente.departureStation)) {
              cola.push({ vuelo: vueloSiguiente, padre: nodoActual });
            }
          });
        }
      }
      // console.log(ruta);
      ruta.forEach((element) => {
        this.flights.push({
          transport: {
            flightCarrier: element.flightCarrier,
            flightNumber: element.flightNumber,
          },
          origin: element.departureStation,
          destination: element.arrivalStation,
          price: element.price,
        });
      });
    }
    // console.log(this.flights);

    if (this.flights.length == [].length) {
      this.toast.error('Su consulta no pudo ser procesada');
      this.cleanAll();
      return;
    }

    // console.log(this.jorneyForm.get('numberFlights')?.value);

    if (
      this.jorneyForm.get('numberFlights')?.value != null &&
      this.flights.length > this.jorneyForm.get('numberFlights')?.value
    ) {
      this.toast.warning('Se supero el numero de viajes');
      this.cleanAll();
      return;
    }
    this.fillJourney();
  }

  fillJourney() {
    if (this.flights.length > 0) {
      this.flights.forEach((element) => {
        this.totalPrice = this.totalPrice + element.price;
      });
    }
    this.journey = {
      flights: this.flights ?? [],
      origin: this.jorneyForm.get('origin')?.value,
      destination: this.jorneyForm.get('destination')?.value,
      currency: 'USD',
      price: this.totalPrice,
    };

    // console.log(this.journey);
    this.journeyComplete.emit(this.journey);
  }

  cleanAll() {
    this.jorneyForm.reset();
    this.flightData = [];
    this.flights = [];
    this.journey = {
      flights: [],
      origin: '',
      destination: '',
      currency: 'USD',
      price: 0,
    };
    this.jorneyForm.get('origin')?.enable();
    this.jorneyForm.get('destination')?.enable();
    this.totalPrice = 0;
  }
}
