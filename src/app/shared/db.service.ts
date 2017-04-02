import { Injectable, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AngularFire } from 'angularfire2';
@Injectable()
export class DBService {
  constructor(private af: AngularFire) {
  }

  public postChangeExamination(subject: Observable<any>) {
    subject.subscribe(s => {
      s.timeUpdated = Date.now();
      this.af.database.object(`/subjects/${s.$key}`).update(s);
    });
  }

  public postChangeProblem(subject: Observable<any>, examination: Observable<any>) {
    subject.subscribe(s => {
      s.timeUpdated = Date.now();
      this.af.database.object(`/subjects/${s.$key}`).update(s);
      examination.subscribe(e => {
        e.timeUpdated = Date.now();
        this.af.database.object(`/examinations/${s.$key}/${e.$key}`).update(e);
      });
    });
  }
}
