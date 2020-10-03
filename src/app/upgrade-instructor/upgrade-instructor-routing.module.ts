import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpgradeInstructorPage } from './upgrade-instructor.page';

const routes: Routes = [
  {
    path: '',
    component: UpgradeInstructorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpgradeInstructorPageRoutingModule {}
