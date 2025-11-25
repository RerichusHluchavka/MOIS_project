import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DispensingPage } from './dispensing.page';

describe('DispensingPage', () => {
  let component: DispensingPage;
  let fixture: ComponentFixture<DispensingPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(DispensingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
