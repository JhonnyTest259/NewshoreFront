import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { HomePageComponent } from './home-page/home-page.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputOriginDestinationComponent } from './components/input-origin-destination/input-origin-destination.component';
import { ResultComponent } from './components/result/result.component';

@NgModule({
  declarations: [PagesComponent, HomePageComponent, InputOriginDestinationComponent, ResultComponent],
  imports: [CommonModule, PagesRoutingModule, SharedModule, MaterialModule, FormsModule, ReactiveFormsModule],
})
export class PagesModule {}
