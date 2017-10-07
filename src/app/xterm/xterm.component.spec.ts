import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XtermComponent } from './xterm.component';

describe('XtermComponent', () => {
  let component: XtermComponent;
  let fixture: ComponentFixture<XtermComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XtermComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XtermComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
