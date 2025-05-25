import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoonPhasesComponent } from './moon-phases.component';

describe('MoonPhasesComponent', () => {
  let component: MoonPhasesComponent;
  let fixture: ComponentFixture<MoonPhasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoonPhasesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoonPhasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
