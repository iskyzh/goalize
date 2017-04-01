import { Injectable, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class ApiService {
  public NavbarColor$: Subject<any>;

  constructor() {
    this.NavbarColor$ = new Subject;
  }
}
