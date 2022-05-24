import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintButtonComponent } from './mint-button.component';

describe('MintButtonComponent', () => {
  let component: MintButtonComponent;
  let fixture: ComponentFixture<MintButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MintButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MintButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
