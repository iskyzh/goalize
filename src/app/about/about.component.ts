import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { ApiService } from '../shared';
import * as _ from 'lodash';
import { Subject } from '../models';

@Component({
  selector: 'my-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  private subject: Observable<Subject>;
  private subjectID: string;

  constructor(private route: ActivatedRoute, private api: ApiService, af: AngularFire) {
    this.subject = this.route.params
      .switchMap((params: Params) => {
        this.subjectID = params['id'];
        return af.database.object(`/subjects/${this.subjectID}`);
      });
    this.subject.subscribe(s => api.NavbarColor$.next(s.color))
  }

  ngOnInit() {
  }

}
