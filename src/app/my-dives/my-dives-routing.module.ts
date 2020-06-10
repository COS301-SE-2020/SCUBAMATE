import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyDivesPage } from './my-dives.page';

const routes: Routes = [
  {
    path: '',
    component: MyDivesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyDivesPageRoutingModule {}
