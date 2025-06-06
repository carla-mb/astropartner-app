import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlannedEventsComponent } from './planned-events.component';

describe('PlannedEventsComponent', () => {
  let component: PlannedEventsComponent;
  let fixture: ComponentFixture<PlannedEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlannedEventsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlannedEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
