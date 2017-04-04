import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { ApiService, DBService } from '../shared';
import * as _ from 'lodash';
import { Subject, Examination, Problem, MATERIAL_COLORS_DATA, EXAMINATION_COLOR } from '../models';

@Component({
  selector: 'my-examination',
  templateUrl: './examination.component.html',
  styleUrls: ['./examination.component.scss']
})
export class ExaminationComponent implements OnInit {
  private subject: Observable<any>;
  private examination: Observable<any>;
  private subjectID: string;
  private examinationID: string;
  private problems: Observable<any>;
  private problems$: Observable<any>;
  private __problem: Problem;
  private tags$: any;

  @ViewChild('problemContent') private problemModal: ElementRef;

  constructor(private route: ActivatedRoute, private api: ApiService, private db: DBService, private af: AngularFire, private modalService: NgbModal) {
    this.subject = route.params.switchMap((params: Params) => af.database.object(this.api.f(`/subjects/${params['sid']}`)));
    this.examination = route.params.switchMap((params: Params) => af.database.object(this.api.f(`/examinations/${params['sid']}/${params['eid']}`)));
    this.problems = route.params.switchMap((params: Params) => af.database.list(this.api.f(`/problems/${params['eid']}`)));
    this.problems$ = this.problems.map(d => {
      let _d = [];
      let index: number = 0;
      _.forEach(d, (v: Problem) => {
        index = index + v.group;
        _d.push(_.merge(v, { index }))
      });
      return _d;
    });
  }

  public atType: Array<any>;
  public atReason: Array<any>;
  public atKnowledge: Array<any>;

  ngOnInit() {
    this.subject.subscribe(s => {
      this.api.NavbarColor$.next(s.color);
      this.subjectID = s.$key;
      this.tags$ = this.db.getTags(this.subjectID);
      this.tags$.subscribe(tags => {
        this.atType = tags.type || [];
        this.atReason = tags.reason || [];
        this.atKnowledge = tags.knowledge || [];
        console.log(this.atKnowledge);
      });
    });
    this.examination.subscribe(e => {
      this.subject.first().subscribe(s => {
        this.api.NavbarTitle$.next(`Goalize>${s.name}>${e.name}`);
        this.examinationID = e.$key;
      })
    });
    this.__problem = this.createProblem();
  }

  createProblem() {
    let _p = new Problem;
    _p.group = 1;
    return _p;
  }

  addProblem(problem) {
    this.af.database.list(this.api.f(`/problems/${this.examinationID}`)).push(problem);
    this.db.postChangeProblem(this.subject, this.examination, problem);
  }

  open(content) {
    this.modalService.open(content).result.then((result) => {
      if (result == 'ok' || result == 'next') {
        this.__problem.timeCreated = Date.now();
        this.__problem.timeUpdated = Date.now();
        this.addProblem(this.__problem);
        this.__problem = this.createProblem();
        if (result == 'next') {
          this.open(this.problemModal);
        }
      }
    }, (reason) => {
    });
  }
}
