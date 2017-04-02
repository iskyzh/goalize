import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { SubjectComponent } from './subject/subject.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'subject/:id', component: SubjectComponent },
  { path: 'subject/:id/examination/:eid', component: SubjectComponent }
];

export const routing = RouterModule.forRoot(routes);
