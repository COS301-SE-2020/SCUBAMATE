import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TechnicalPageRoutingModule } from './technical-routing.module';

import { TechnicalPage } from './technical.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TechnicalPageRoutingModule
  ],
  declarations: [TechnicalPage]
})
export class TechnicalPageModule {}
