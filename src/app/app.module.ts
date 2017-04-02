import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { MomentModule } from 'angular2-moment';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SubjectComponent } from './subject/subject.component';
import { ExaminationComponent } from './examination/examination.component';
import { ApiService, DBService } from './shared';
import { routing } from './app.routing';
import { AngularFireModule } from 'angularfire2';
import { removeNgStyles, createNewHosts } from '@angularclass/hmr';
import { TagInputModule } from 'ng2-tag-input';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    BrowserAnimationsModule,
    routing,
    AngularFireModule.initializeApp(require('../../config/firebase.js')),
    MomentModule,
    NgbModule.forRoot(),
    TagInputModule
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    SubjectComponent,
    ExaminationComponent
  ],
  providers: [
    ApiService,
    DBService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(public appRef: ApplicationRef) {}
  hmrOnInit(store) {
    console.log('HMR store', store);
  }
  hmrOnDestroy(store) {
    let cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    // recreate elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // remove styles
    removeNgStyles();
  }
  hmrAfterDestroy(store) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }
}
