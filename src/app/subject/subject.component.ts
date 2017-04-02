import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { ApiService } from '../shared';
import * as _ from 'lodash';
import { Subject, Examination, MATERIAL_COLORS_DATA, EXAMINATION_COLOR } from '../models';

@Component({
  selector: 'my-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss']
})
export class SubjectComponent implements OnInit, OnDestroy {
  private subject: Observable<any>;
  private subjectColor: string;
  private examinations$: Observable<any>;
  private examinations: Observable<any>;
  private __examination: Examination;
  private subjectID: string;

  constructor(private route: ActivatedRoute, private api: ApiService, private af: AngularFire, private modalService: NgbModal) {
    this.subject = route.params.switchMap((params: Params) => af.database.object(`/subjects/${params['id']}`));
    this.examinations = route.params.switchMap((params: Params) => af.database.list(`/examinations/${params['id']}`));
    this.examinations$ = this.examinations.map(e => _(e).sortBy('date').map((e, i) => _.merge(e, { color: MATERIAL_COLORS_DATA[this.subjectColor][EXAMINATION_COLOR(i)] })).reverse().value());
  }

  ngOnInit() {
    this.subject.subscribe(s => {
      this.api.NavbarColor$.next(s.color);
      this.api.NavbarTitle$.next(`Goalize>${s.name}`);
      this.subjectColor = s.color;
      this.subjectID = s.$key;
    });
    this.__examination = new Examination;
  }

  ngOnDestroy() {
  }

  addExamination(examination) {
    this.af.database.list(`/examinations/${this.subjectID}`).push(examination);
  }

  open(content) {
    this.modalService.open(content).result.then((result) => {
      if (result == 'ok') {
        this.__examination.timeCreated = Date.now();
        this.__examination.timeUpdated = Date.now();
        this.__examination.date = (new Date(this.__examination.date)).getTime();
        this.addExamination(this.__examination);
        this.__examination = new Examination;
      }
    }, (reason) => {
    });
  }
}
