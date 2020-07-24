import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditDivePage } from './edit-dive.page';

const routes: Routes = [
  {
    path: '',
    component: EditDivePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditDivePageRoutingModule {}
