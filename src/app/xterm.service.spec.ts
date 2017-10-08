import { TestBed, inject } from '@angular/core/testing';

import { XtermService } from './xterm.service';

describe('XtermService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [XtermService]
    });
  });

  it('should be created', inject([XtermService], (service: XtermService) => {
    expect(service).toBeTruthy();
  }));
});
