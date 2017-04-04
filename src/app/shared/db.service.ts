import { Injectable, EventEmitter } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AngularFire } from 'angularfire2';
import { ApiService } from '.';
import { Problem } from '../models';
import * as _ from "lodash";

@Injectable()
export class DBService {

  private tags: any;
  private _$: Subscription;

  constructor(private af: AngularFire, private api: ApiService) {
    this.initializeAutoComplete();
  }

  public initializeAutoComplete() {
    this.tags = {};
  }

  public getTags(subjectID: string) {
    return this.af.database.object(this.api.f(`/tags/${subjectID}`));
  }

  public postChangeExamination(subject: Observable<any>) {
    subject.first().subscribe(s => {
      s.timeUpdated = Date.now();
      this.af.database.object(this.api.f(`/subjects/${s.$key}`)).update(s);
    });
  }

  public postChangeProblem(subject: Observable<any>, examination: Observable<any>, problem: Problem) {
    subject.first().subscribe(s => {
      s.timeUpdated = Date.now();
      this.af.database.object(this.api.f(`/subjects/${s.$key}`)).update(s);
      examination.first().subscribe(e => {
        e.timeUpdated = Date.now();
        e.detail = e.detail || {};
        this.af.database.list(this.api.f(`/problems/${e.$key}`)).first().subscribe(ps => {
          e.detail.score = _.sum(_.map(ps, 'score'));
          e.detail.totalScore = _.sum(_.map(ps, 'totalScore'));
          this.af.database.object(this.api.f(`/examinations/${s.$key}/${e.$key}`)).update(e);
        })
      });
      this.af.database.object(this.api.f(`/tags/${s.$key}`)).first().subscribe(tags => {
        this.af.database.object(this.api.f(`/tags/${s.$key}`)).update(
          _.mapValues({'reason': [], 'knowledge': [], 'type': []}, (v, d) => _.unionBy(problem[d], tags[d], 'value'))
        );
      });
    });
  }
}
