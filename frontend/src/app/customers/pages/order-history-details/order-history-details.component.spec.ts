import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderHistoryDetailsComponent } from './order-history-details.component';

describe('OrderHistoryDetailsComponent', () => {
  let component: OrderHistoryDetailsComponent;
  let fixture: ComponentFixture<OrderHistoryDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderHistoryDetailsComponent]
    });
    fixture = TestBed.createComponent(OrderHistoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
