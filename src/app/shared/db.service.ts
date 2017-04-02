import { Injectable, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AngularFire } from 'angularfire2';
import { ApiService } from '.';

@Injectable()
export class DBService {
  constructor(private af: AngularFire, private api: ApiService) {
  }

  public postChangeExamination(subject: Observable<any>) {
    subject.subscribe(s => {
      s.timeUpdated = Date.now();
      this.af.database.object(this.api.f(`/subjects/${s.$key}`)).update(s);
    });
  }

  public postChangeProblem(subject: Observable<any>, examination: Observable<any>) {
    subject.subscribe(s => {
      s.timeUpdated = Date.now();
      this.af.database.object(this.api.f(`/subjects/${s.$key}`)).update(s);
      examination.subscribe(e => {
        e.timeUpdated = Date.now();
        this.af.database.object(this.api.f(`/examinations/${s.$key}/${e.$key}`)).update(e);
      });
    });
  }
}
