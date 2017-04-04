import { Injectable, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class ApiService {
  public NavbarColor$: Subject<any>;
  public NavbarTitle$: Subject<any>;
  private $uid: string = localStorage.getItem('auth');
  
  constructor() {
    this.NavbarColor$ = new Subject;
    this.NavbarTitle$ = new Subject;
  }

  public f(url: string) {
    return `/${this.$uid}${url}`;
  }
}
