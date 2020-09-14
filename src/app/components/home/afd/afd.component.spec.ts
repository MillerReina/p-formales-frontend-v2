import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AfdComponent } from './afd.component';

describe('AfdComponent', () => {
  let component: AfdComponent;
  let fixture: ComponentFixture<AfdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AfdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AfdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
