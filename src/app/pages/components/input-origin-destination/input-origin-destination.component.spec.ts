import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputOriginDestinationComponent } from './input-origin-destination.component';

describe('InputOriginDestinationComponent', () => {
  let component: InputOriginDestinationComponent;
  let fixture: ComponentFixture<InputOriginDestinationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputOriginDestinationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputOriginDestinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
