import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { cloneDeep } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Flight } from 'src/app/interfaces/Flight';
import { Flights } from 'src/app/interfaces/Flights';
import { Jorneys } from 'src/app/interfaces/Jorneys';
import { serviceType } from 'src/app/interfaces/service.type';
import { HttpService } from 'src/app/services/services.service';

@Component({
  selector: 'app-input-origin-destination',
  templateUrl: './input-origin-destination.component.html',
  styleUrls: ['./input-origin-destination.component.scss'],
})
export class InputOriginDestinationComponent implements OnInit {
  @Output('journeyComplete') journeyComplete: EventEmitter<Jorneys> =
    new EventEmitter();
  flightData!: Jorneys;
  jorneyForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private _httpSrv: HttpService
  ) {}
  ngOnInit(): void {
    this.initForm();
    this.createSubscriptions();
  }

  initForm() {
    this.jorneyForm = this.fb.group({
      origin: ['', [Validators.required, Validators.minLength(3)]],
      destination: ['', [Validators.required, Validators.minLength(3)]],
      numberFlights: [null],
    });
  }
  createSubscriptions() {
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

    let response: Jorneys | any = await this.loadData();
    this.journeyComplete.emit(response);
  }
  loadData() {
    return new Promise((resolve) => {
      try {
        this._httpSrv
          .getJourney(this.jorneyForm.value)
          .subscribe((response: Jorneys | null) => {
            if (response != null) {
              resolve(response);
            }
          });
      } catch (error) {
        console.error(error);
      }
    });
  }

  cleanAll() {
    this.jorneyForm.reset();
  }
}
