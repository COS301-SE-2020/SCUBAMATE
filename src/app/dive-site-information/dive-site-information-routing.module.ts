import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DiveSiteInformationPage } from './dive-site-information.page';

const routes: Routes = [
  {
    path: '',
    component: DiveSiteInformationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiveSiteInformationPageRoutingModule {}
