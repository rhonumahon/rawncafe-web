import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyaltyCardComponent } from './loyalty-card.component';

describe('LoyaltyCardComponent', () => {
  let component: LoyaltyCardComponent;
  let fixture: ComponentFixture<LoyaltyCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoyaltyCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoyaltyCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
