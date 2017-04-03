import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './shared';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AngularFire, AuthProviders, AuthMethods, FirebaseObjectObservable } from 'angularfire2';

import '../style/app.scss';

@Component({
  selector: 'my-app', // <my-app></my-app>
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('authContent') private authModal: ElementRef;
  
  private current_color: string = "grey";
  private current_title: string[] = ["Loading..."];
  private connected$: FirebaseObjectObservable<any>;
  private __version: string = process.env.VERSION;

  constructor(private api: ApiService, private modalService: NgbModal, private af: AngularFire) {
    api.NavbarColor$.subscribe(color => this.current_color = color);
    api.NavbarTitle$.subscribe(title => this.current_title = title.split('>'));
    this.connected$ = af.database.object('/.info/connected');
  }

  ngAfterViewInit() {
    this.af.auth.subscribe(auth => {
      if (!auth) this.requestAuth();
      if (localStorage.getItem('auth') != auth.uid) {
        localStorage.setItem('auth', auth.uid);
        location.reload();
      }
    }, e => this.requestAuth())
  }

  requestAuth() {
    this.modalService.open(this.authModal).result.then((result) => {
    }, (reason) => {
      this.requestAuth();
    });
  }

  loginViaGoogle() {
    this.af.auth.login({
      provider: AuthProviders.Google,
      method: AuthMethods.Redirect
    });
  }

  loginViaTwitter() {
    this.af.auth.login({
      provider: AuthProviders.Twitter,
      method: AuthMethods.Redirect
    });
  }

  loginViaGitHub() {
    this.af.auth.login({
      provider: AuthProviders.Github,
      method: AuthMethods.Redirect
    });
  }

  logout() {
    this.af.auth.logout().then(d => {
      location.reload();
    });
  }
}
