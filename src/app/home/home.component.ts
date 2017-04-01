import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { ApiService } from '../shared';
import * as _ from 'lodash';
import { Subject } from '../models';

@Component({
  selector: 'my-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  private subjects: FirebaseListObservable<any>;
  private colors = ['red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green', 'light-green', 'lime', 'yellow', 'amber', 'orange', 'deep-orange', 'brown', 'grey', 'blue-grey']
  private __subject: Subject = new Subject;

  constructor(private api: ApiService, private modalService: NgbModal, af: AngularFire) {
    this.subjects = af.database.list('/subjects');
    api.NavbarColor$.next('grey');
  }

  addSubject(data) {
    this.subjects.push(data);
  }

  open(content) {
    this.modalService.open(content).result.then((result) => {
      if (result == 'ok') {
        this.__subject.timeCreated = Date.now();
        this.__subject.timeUpdated = Date.now();
        this.addSubject(this.__subject);
        this.__subject = new Subject();
      }
    }, (reason) => {
    });
  }
}
