import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LogDivePage } from './log-dive.page';

const routes: Routes = [
  {
    path: '',
    component: LogDivePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogDivePageRoutingModule {}
