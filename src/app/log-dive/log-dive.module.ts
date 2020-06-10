import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LogDivePageRoutingModule } from './log-dive-routing.module';

import { LogDivePage } from './log-dive.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LogDivePageRoutingModule
  ],
  declarations: [LogDivePage]
})
export class LogDivePageModule {}
