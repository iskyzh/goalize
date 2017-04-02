import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { SubjectComponent } from './subject/subject.component';
import { ExaminationComponent } from './examination/examination.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'subject/:id', component: SubjectComponent },
  { path: 'subject/:sid/examination/:eid', component: ExaminationComponent }
];

export const routing = RouterModule.forRoot(routes);
