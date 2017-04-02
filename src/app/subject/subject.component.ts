import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
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
export class SubjectComponent implements OnInit {
  private subject: Observable<Subject>;
  private subjectID: string;
  private subjectColor: string;
  private examinations$: Observable<any>;
  private examinations: FirebaseListObservable<any>;
  private __examination: Examination;

  constructor(private route: ActivatedRoute, private api: ApiService, private af: AngularFire, private modalService: NgbModal) {
    this.subject = this.route.params
      .switchMap((params: Params) => {
        this.subjectID = params['id'];
        this.examinations = af.database.list(`/examinations/${this.subjectID}`);
        return af.database.object(`/subjects/${this.subjectID}`);
      });
    this.subject.subscribe(s => {
      api.NavbarColor$.next(s.color);
      api.NavbarTitle$.next(`Goalize>${s.name}`);
      this.subjectColor = s.color;
    });
    this.examinations$ = this.examinations.map(e => _(e).sortBy('date').map((e, i) => _.merge(e, { color: MATERIAL_COLORS_DATA[this.subjectColor][EXAMINATION_COLOR(i)] })).reverse().value());
    this.__examination = new Examination;
  }

  ngOnInit() {
    console.log(MATERIAL_COLORS_DATA)
  }

  addExamination(examination) {
    this.examinations.push(examination);
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
