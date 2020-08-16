import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DiveSiteInformationPageRoutingModule } from './dive-site-information-routing.module';

import { DiveSiteInformationPage } from './dive-site-information.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DiveSiteInformationPageRoutingModule
  ],
  declarations: [DiveSiteInformationPage]
})
export class DiveSiteInformationPageModule {}
