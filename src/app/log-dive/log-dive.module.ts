import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LogDivePageRoutingModule } from './log-dive-routing.module';

import { LogDivePage } from './log-dive.page';

//rating 
import { IonicRatingModule  } from 'ionic4-rating';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicRatingModule,
    LogDivePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [LogDivePage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LogDivePageModule {}
