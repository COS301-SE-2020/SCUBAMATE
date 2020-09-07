import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DiveCenterInformationPageRoutingModule } from './dive-center-information-routing.module';

import { DiveCenterInformationPage } from './dive-center-information.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DiveCenterInformationPageRoutingModule
  ],
  declarations: [DiveCenterInformationPage]
})
export class DiveCenterInformationPageModule {}
