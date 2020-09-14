import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AfndComponent } from './afnd.component';

describe('AfndComponent', () => {
  let component: AfndComponent;
  let fixture: ComponentFixture<AfndComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AfndComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AfndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
